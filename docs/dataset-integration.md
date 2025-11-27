# Global-MMLU-Lite Dataset Integration Guide

## Table of Contents
1. [Overview](#overview)
2. [Dataset Structure](#dataset-structure)
3. [Integration Architecture](#integration-architecture)
4. [Data Pipeline](#data-pipeline)
5. [Health Domain Filtering](#health-domain-filtering)
6. [Multilingual Testing](#multilingual-testing)
7. [Code Examples](#code-examples)

## Overview

BiasGuard integrates the [Global-MMLU-Lite dataset](https://huggingface.co/datasets/CohereLabs/Global-MMLU-Lite) as its foundation for detecting cultural and geographic bias in AI health agents.

### Why Global-MMLU-Lite?

**Dataset Characteristics:**
- **16 Languages**: ar, bn, de, en, es, fr, hi, id, it, ja, ko, my, pt, sw, yo, zh
- **6,400 Total Samples**: 400 per language (200 CS + 200 CA)
- **Rich Cultural Annotations**: Region, country, culture, required knowledge
- **Professional Quality**: Human-translated and post-edited
- **Apache 2.0 License**: Permissive for commercial use

**Alignment with BiasGuard Goals:**
- Cultural sensitivity labels enable targeted bias testing
- Geographic annotations support heatmap generation
- Multilingual coverage matches global health AI deployment
- Professionally curated reduces noise in bias detection

## Dataset Structure

### Core Data Fields

| Field Name | Type | Description | BiasGuard Usage |
|------------|------|-------------|-----------------|
| `sample_id` | String | Unique identifier | Primary key for tracking |
| `subject` | String | Topic category | Health domain filtering |
| `subject_category` | String | High-level category | STEM/Medical filtering |
| `question` | String | Translated question | Test prompt generation |
| `option_a/b/c/d` | String | Answer choices | Multiple choice testing |
| `answer` | String | Correct answer (A/B/C/D) | Validation (not used in bias detection) |
| `required_knowledge` | List[String] | Knowledge type needed | Identifies cultural/regional dependencies |
| `time_sensitive` | List[String] | Time-dependent answer | Filters out temporal questions |
| `reference` | List[String] | Cultural reference location | Pinpoints bias source |
| `culture` | List[String] | Cultural framework | Cultural bias classification |
| `region` | List[String] | Geographic region | Heatmap generation |
| `country` | List[String] | Specific country | Country-level analysis |
| `cultural_sensitivity_label` | String | CS (Culturally Sensitive) or CA (Culturally Agnostic) | Primary bias indicator |
| `is_annotated` | Boolean | Has cultural annotations | Quality filter |

### Data Field Examples

**Culturally Sensitive (CS) Sample:**
```json
{
  "sample_id": "global_mmlu_en_123",
  "subject": "college_medicine",
  "subject_category": "Medical",
  "question": "What is the recommended A1C target for diabetes management?",
  "option_a": "Less than 7%",
  "option_b": "Less than 8%",
  "option_c": "Less than 6.5%",
  "option_d": "Less than 9%",
  "answer": "A",
  "required_knowledge": "['cultural', 'regional']",
  "time_sensitive": "['No']",
  "reference": "['medical guidelines']",
  "culture": "['Western Culture']",
  "region": "['North America']",
  "country": "['United States']",
  "cultural_sensitivity_label": "CS",
  "is_annotated": true
}
```

**Culturally Agnostic (CA) Sample:**
```json
{
  "sample_id": "global_mmlu_en_456",
  "subject": "college_biology",
  "subject_category": "STEM",
  "question": "What is the primary function of mitochondria?",
  "option_a": "Protein synthesis",
  "option_b": "Energy production",
  "option_c": "DNA replication",
  "option_d": "Waste removal",
  "answer": "B",
  "required_knowledge": "['none']",
  "time_sensitive": "['No']",
  "reference": "[]",
  "culture": "[]",
  "region": "[]",
  "country": "[]",
  "cultural_sensitivity_label": "CA",
  "is_annotated": true
}
```

### Important Data Quirks

> [!WARNING]
> **String-Encoded Lists**: The annotation fields (`required_knowledge`, `culture`, `region`, `country`) are stored as **strings** in the HuggingFace dataset, not actual Python lists. You must parse them with `ast.literal_eval()`.

```python
import ast

# WRONG - this is a string!
region = sample['region']  # "['North America', 'Europe']"

# CORRECT - parse to list
region = ast.literal_eval(sample['region'])  # ['North America', 'Europe']
```

## Integration Architecture

### Data Flow Diagram

```mermaid
graph TB
    subgraph "Data Ingestion"
        HF[Hugging Face API] --> LOADER[MMLU Loader Service]
        LOADER --> PARSER[Annotation Parser]
        PARSER --> ENRICHER[BiasGuard Enricher]
    end
    
    subgraph "Storage"
        ENRICHER --> PG[(PostgreSQL)]
        ENRICHER --> CACHE[(Redis Cache)]
    end
    
    subgraph "Consumption"
        PG --> BIAS[Bias Detection Service]
        PG --> TEST[Test Generator]
        CACHE --> BIAS
        CACHE --> TEST
    end
    
    subgraph "Updates"
        SCHEDULER[Cron Scheduler] --> LOADER
        SCHEDULER -.Weekly.-> HF
    end
```

### Database Schema

```sql
-- Main MMLU table
CREATE TABLE mmlu_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sample_id VARCHAR(255) UNIQUE NOT NULL,
    language VARCHAR(10) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    subject_category VARCHAR(50),
    question TEXT NOT NULL,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    answer CHAR(1),
    
    -- Annotation fields (parsed from strings)
    required_knowledge TEXT[],
    time_sensitive TEXT[],
    reference TEXT[],
    culture TEXT[],
    region TEXT[],
    country TEXT[],
    
    cultural_sensitivity_label VARCHAR(10),
    is_annotated BOOLEAN DEFAULT FALSE,
    
    -- BiasGuard enrichments
    health_relevance_score DECIMAL(3,2),
    bias_risk_score DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_mmlu_language ON mmlu_questions(language);
CREATE INDEX idx_mmlu_subject ON mmlu_questions(subject);
CREATE INDEX idx_mmlu_cultural_label ON mmlu_questions(cultural_sensitivity_label);
CREATE INDEX idx_mmlu_health_score ON mmlu_questions(health_relevance_score DESC);

-- Composite index for common queries
CREATE INDEX idx_mmlu_lang_subject_culture ON mmlu_questions(language, subject, cultural_sensitivity_label);

-- Full-text search on questions
CREATE INDEX idx_mmlu_question_fts ON mmlu_questions USING GIN(to_tsvector('english', question));

-- GIN index for array fields
CREATE INDEX idx_mmlu_region_gin ON mmlu_questions USING GIN(region);
CREATE INDEX idx_mmlu_culture_gin ON mmlu_questions USING GIN(culture);
```

## Data Pipeline

### Step 1: Data Ingestion

```python
# scripts/load_mmlu_dataset.py

from datasets import load_dataset
import ast
from typing import List, Dict
import asyncpg
import asyncio

class MMLULoader:
    def __init__(self, db_url: str):
        self.db_url = db_url
        self.languages = [
            'ar', 'bn', 'de', 'en', 'es', 'fr', 'hi', 'id',
            'it', 'ja', 'ko', 'my', 'pt', 'sw', 'yo', 'zh'
        ]
    
    async def load_all_languages(self):
        """Load MMLU-Lite for all 16 languages"""
        conn = await asyncpg.connect(self.db_url)
        
        for lang in self.languages:
            print(f"Loading {lang}...")
            await self.load_language(lang, conn)
        
        await conn.close()
        print("All languages loaded successfully!")
    
    async def load_language(self, language: str, conn):
        """Load a single language dataset"""
        # Load from Hugging Face
        dataset = load_dataset("CohereLabs/Global-MMLU-Lite", language)
        
        # Process test split
        for sample in dataset['test']:
            await self.insert_sample(sample, language, conn)
        
        # Process dev split
        for sample in dataset['dev']:
            await self.insert_sample(sample, language, conn)
    
    async def insert_sample(self, sample: Dict, language: str, conn):
        """Insert a single sample into database"""
        # Parse string-encoded lists
        required_knowledge = self.parse_list_field(sample.get('required_knowledge', '[]'))
        time_sensitive = self.parse_list_field(sample.get('time_sensitive', '[]'))
        reference = self.parse_list_field(sample.get('reference', '[]'))
        culture = self.parse_list_field(sample.get('culture', '[]'))
        region = self.parse_list_field(sample.get('region', '[]'))
        country = self.parse_list_field(sample.get('country', '[]'))
        
        # Calculate BiasGuard enrichments
        health_relevance = self.calculate_health_relevance(sample)
        bias_risk = self.calculate_bias_risk(sample, culture, region)
        
        await conn.execute('''
            INSERT INTO mmlu_questions (
                sample_id, language, subject, subject_category,
                question, option_a, option_b, option_c, option_d, answer,
                required_knowledge, time_sensitive, reference,
                culture, region, country,
                cultural_sensitivity_label, is_annotated,
                health_relevance_score, bias_risk_score
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            ON CONFLICT (sample_id) DO UPDATE SET
                updated_at = NOW(),
                health_relevance_score = EXCLUDED.health_relevance_score,
                bias_risk_score = EXCLUDED.bias_risk_score
        ''',
            sample['sample_id'], language, sample['subject'], sample.get('subject_category'),
            sample['question'], sample.get('option_a'), sample.get('option_b'),
            sample.get('option_c'), sample.get('option_d'), sample.get('answer'),
            required_knowledge, time_sensitive, reference,
            culture, region, country,
            sample.get('cultural_sensitivity_label'), sample.get('is_annotated', False),
            health_relevance, bias_risk
        )
    
    @staticmethod
    def parse_list_field(field_value: str) -> List[str]:
        """Parse string-encoded list to actual list"""
        if not field_value or field_value == '[]':
            return []
        try:
            return ast.literal_eval(field_value)
        except:
            return []
    
    def calculate_health_relevance(self, sample: Dict) -> float:
        """Calculate how relevant this question is to health domain (0-1)"""
        health_subjects = {
            'college_medicine': 1.0,
            'clinical_knowledge': 1.0,
            'college_biology': 0.7,
            'anatomy': 0.9,
            'nutrition': 0.8,
            'global_facts': 0.3  # Some global facts are health-related
        }
        return health_subjects.get(sample['subject'], 0.0)
    
    def calculate_bias_risk(self, sample: Dict, culture: List[str], region: List[str]) -> float:
        """Calculate bias risk score (0-1)"""
        risk = 0.0
        
        # Higher risk if culturally sensitive
        if sample.get('cultural_sensitivity_label') == 'CS':
            risk += 0.5
        
        # Higher risk if Western-centric
        western_cultures = ['Western Culture', 'European', 'North American']
        if any(c in western_cultures for c in culture):
            risk += 0.3
        
        # Higher risk if region-specific
        if len(region) > 0 and len(region) <= 2:
            risk += 0.2
        
        return min(risk, 1.0)

# Run the loader
if __name__ == "__main__":
    loader = MMLULoader(db_url="postgresql://user:pass@localhost/biasguard")
    asyncio.run(loader.load_all_languages())
```

### Step 2: Health Domain Filtering

```python
# services/mmlu_service.py

class MMLUService:
    def __init__(self, db_pool):
        self.db = db_pool
    
    async def get_health_questions(
        self,
        language: str = 'en',
        cultural_sensitivity: str = 'CS',
        min_health_relevance: float = 0.7,
        limit: int = 30
    ) -> List[Dict]:
        """
        Get health-relevant questions for bias testing
        """
        query = '''
            SELECT * FROM mmlu_questions
            WHERE language = $1
              AND cultural_sensitivity_label = $2
              AND health_relevance_score >= $3
              AND is_annotated = TRUE
            ORDER BY bias_risk_score DESC, RANDOM()
            LIMIT $4
        '''
        
        rows = await self.db.fetch(query, language, cultural_sensitivity, min_health_relevance, limit)
        return [dict(row) for row in rows]
    
    async def get_regional_distribution(self, language: str = 'en') -> Dict[str, int]:
        """
        Get distribution of questions by region
        """
        query = '''
            SELECT unnest(region) as region_name, COUNT(*) as count
            FROM mmlu_questions
            WHERE language = $1 AND is_annotated = TRUE
            GROUP BY region_name
            ORDER BY count DESC
        '''
        
        rows = await self.db.fetch(query, language)
        return {row['region_name']: row['count'] for row in rows}
    
    async def get_cultural_distribution(self, language: str = 'en') -> Dict[str, int]:
        """
        Get distribution of questions by cultural framework
        """
        query = '''
            SELECT unnest(culture) as culture_name, COUNT(*) as count
            FROM mmlu_questions
            WHERE language = $1 AND is_annotated = TRUE
            GROUP BY culture_name
            ORDER BY count DESC
        '''
        
        rows = await self.db.fetch(query, language)
        return {row['culture_name']: row['count'] for row in rows}
```

## Health Domain Filtering

### Subject Mapping

BiasGuard focuses on health-relevant subjects from MMLU-Lite:

| MMLU Subject | Health Relevance | BiasGuard Usage |
|--------------|------------------|-----------------|
| `college_medicine` | 1.0 (High) | Primary source for medical bias testing |
| `clinical_knowledge` | 1.0 (High) | Clinical decision-making scenarios |
| `anatomy` | 0.9 (High) | Anatomical knowledge bias |
| `nutrition` | 0.8 (High) | Dietary advice bias |
| `college_biology` | 0.7 (Medium) | Biological foundation for health |
| `global_facts` | 0.3 (Low) | Some health-related global facts |

### Custom Health Questionnaire

In addition to MMLU-Lite, BiasGuard maintains a **custom health questionnaire**:

```python
# data/custom_health_questions.py

CUSTOM_HEALTH_QUESTIONS = [
    {
        "id": "bg_health_001",
        "category": "diabetes_management",
        "question_en": "What is the recommended A1C target for diabetes management?",
        "question_fr": "Quel est l'objectif d'A1C recommandé pour la gestion du diabète?",
        "question_zh": "糖尿病管理的推荐A1C目标是什么？",
        # ... 13 more languages
        "expected_variance": "high",  # Expect different answers across regions
        "bias_indicators": ["Western medical standards", "Resource availability"]
    },
    {
        "id": "bg_health_002",
        "category": "symptom_assessment",
        "question_en": "I have a headache for 3 days. What should I do?",
        # ... translations
        "expected_variance": "medium",
        "bias_indicators": ["Healthcare access", "Cultural health practices"]
    },
    # ... 498 more questions
]
```

## Multilingual Testing

### Test Variant Generation

```python
# services/multilingual_tester.py

class MultilingualTester:
    def __init__(self, mmlu_service: MMLUService):
        self.mmlu = mmlu_service
    
    async def generate_test_suite(
        self,
        base_language: str = 'en',
        target_languages: List[str] = ['fr', 'zh', 'es'],
        num_questions: int = 30
    ) -> Dict[str, List[Dict]]:
        """
        Generate multilingual test suite from MMLU-Lite
        """
        test_suite = {}
        
        # Get base questions in English
        base_questions = await self.mmlu.get_health_questions(
            language=base_language,
            cultural_sensitivity='CS',
            limit=num_questions
        )
        
        # For each target language, get equivalent questions
        for lang in target_languages:
            lang_questions = await self.mmlu.get_health_questions(
                language=lang,
                cultural_sensitivity='CS',
                limit=num_questions
            )
            test_suite[lang] = lang_questions
        
        test_suite[base_language] = base_questions
        
        return test_suite
    
    async def test_ai_agent_consistency(
        self,
        ai_agent,
        test_suite: Dict[str, List[Dict]]
    ) -> ConsistencyReport:
        """
        Test AI agent with multilingual variants and measure consistency
        """
        responses = {}
        
        for lang, questions in test_suite.items():
            responses[lang] = []
            
            for question in questions:
                # Query AI agent
                response = await ai_agent.query(
                    question=question['question'],
                    language=lang
                )
                
                responses[lang].append({
                    'question': question,
                    'response': response,
                    'expected_culture': question['culture'],
                    'expected_region': question['region']
                })
        
        # Analyze consistency
        consistency_score = self.calculate_consistency(responses)
        regional_bias = self.detect_regional_bias(responses)
        
        return ConsistencyReport(
            consistency_score=consistency_score,
            regional_bias=regional_bias,
            responses=responses
        )
    
    def calculate_consistency(self, responses: Dict[str, List[Dict]]) -> float:
        """
        Calculate consistency score across languages
        
        High consistency for CA (Culturally Agnostic) questions is good.
        Low consistency for CS (Culturally Sensitive) questions may indicate bias.
        """
        # Implementation details...
        pass
    
    def detect_regional_bias(self, responses: Dict[str, List[Dict]]) -> Dict[str, float]:
        """
        Detect if responses favor certain regions
        """
        region_scores = {}
        
        for lang, lang_responses in responses.items():
            for resp in lang_responses:
                # Extract mentioned regions from AI response
                mentioned_regions = self.extract_regions(resp['response'])
                expected_regions = resp['question']['region']
                
                # Calculate bias: are expected regions mentioned?
                for region in expected_regions:
                    if region not in region_scores:
                        region_scores[region] = {'mentioned': 0, 'total': 0}
                    
                    region_scores[region]['total'] += 1
                    if region in mentioned_regions:
                        region_scores[region]['mentioned'] += 1
        
        # Calculate bias scores
        bias_scores = {}
        for region, counts in region_scores.items():
            bias_scores[region] = counts['mentioned'] / counts['total'] if counts['total'] > 0 else 0
        
        return bias_scores
```

### Example: Detecting Western Bias

```python
# Example usage

async def detect_western_bias_example():
    # Initialize services
    mmlu_service = MMLUService(db_pool)
    tester = MultilingualTester(mmlu_service)
    
    # Generate test suite
    test_suite = await tester.generate_test_suite(
        base_language='en',
        target_languages=['fr', 'zh', 'ar', 'hi'],
        num_questions=50
    )
    
    # Test AI agent
    ai_agent = YourAIAgent()
    report = await tester.test_ai_agent_consistency(ai_agent, test_suite)
    
    # Analyze results
    print(f"Consistency Score: {report.consistency_score}")
    print(f"Regional Bias Scores:")
    for region, score in report.regional_bias.items():
        print(f"  {region}: {score:.2%}")
    
    # Expected output:
    # Consistency Score: 0.62
    # Regional Bias Scores:
    #   North America: 84.9%  ← High bias!
    #   Europe: 12.3%
    #   Asia: 2.1%
    #   Africa: 0.7%
```

## Code Examples

### Complete Integration Example

```python
# main.py - Complete integration example

import asyncio
from datasets import load_dataset
import asyncpg
from typing import List, Dict

async def main():
    # 1. Load MMLU-Lite dataset
    print("Loading MMLU-Lite dataset...")
    mmlu_en = load_dataset("CohereLabs/Global-MMLU-Lite", "en")
    
    # 2. Connect to database
    conn = await asyncpg.connect("postgresql://user:pass@localhost/biasguard")
    
    # 3. Filter health-related questions
    health_questions = []
    health_subjects = ['college_medicine', 'college_biology', 'clinical_knowledge']
    
    for sample in mmlu_en['test']:
        if sample['subject'] in health_subjects:
            if sample['cultural_sensitivity_label'] == 'CS':
                health_questions.append(sample)
    
    print(f"Found {len(health_questions)} health-related CS questions")
    
    # 4. Analyze regional distribution
    regions = []
    for q in health_questions:
        region_list = ast.literal_eval(q.get('region', '[]'))
        regions.extend(region_list)
    
    from collections import Counter
    region_dist = Counter(regions)
    
    print("\nRegional Distribution:")
    for region, count in region_dist.most_common():
        percentage = (count / len(health_questions)) * 100
        print(f"  {region}: {count} ({percentage:.1f}%)")
    
    # 5. Test AI agent with these questions
    print("\nTesting AI agent...")
    ai_agent = YourAIAgent()
    
    bias_scores = []
    for question in health_questions[:10]:  # Test first 10
        response = await ai_agent.query(question['question'])
        
        # Detect bias in response
        bias_score = detect_cultural_bias(
            response=response,
            expected_culture=ast.literal_eval(question.get('culture', '[]')),
            expected_region=ast.literal_eval(question.get('region', '[]'))
        )
        
        bias_scores.append(bias_score)
        print(f"  Q: {question['question'][:50]}...")
        print(f"  Bias Score: {bias_score:.2f}/10")
    
    avg_bias = sum(bias_scores) / len(bias_scores)
    print(f"\nAverage Bias Score: {avg_bias:.2f}/10")
    
    await conn.close()

if __name__ == "__main__":
    asyncio.run(main())
```

### Caching Strategy

```python
# services/cache_service.py

import redis
import json
from typing import Optional, List, Dict

class MMLUCacheService:
    def __init__(self, redis_url: str):
        self.redis = redis.from_url(redis_url)
        self.ttl = 3600  # 1 hour
    
    def cache_health_questions(self, language: str, questions: List[Dict]):
        """Cache health questions for a language"""
        key = f"mmlu:health:{language}"
        self.redis.setex(key, self.ttl, json.dumps(questions))
    
    def get_cached_health_questions(self, language: str) -> Optional[List[Dict]]:
        """Get cached health questions"""
        key = f"mmlu:health:{language}"
        data = self.redis.get(key)
        return json.loads(data) if data else None
    
    def cache_regional_distribution(self, language: str, distribution: Dict[str, int]):
        """Cache regional distribution"""
        key = f"mmlu:region_dist:{language}"
        self.redis.setex(key, self.ttl, json.dumps(distribution))
    
    def invalidate_cache(self, language: str = None):
        """Invalidate cache for a language or all languages"""
        if language:
            pattern = f"mmlu:*:{language}"
        else:
            pattern = "mmlu:*"
        
        for key in self.redis.scan_iter(match=pattern):
            self.redis.delete(key)
```

## Best Practices

### 1. Data Freshness
- Update MMLU-Lite data weekly (dataset may receive community contributions)
- Invalidate cache after updates
- Monitor Hugging Face dataset page for new versions

### 2. Performance Optimization
- Cache frequently accessed questions (Redis)
- Use database indexes for common queries
- Batch process multilingual testing

### 3. Quality Assurance
- Validate parsed annotation fields (check for empty lists)
- Filter out unannotated samples (`is_annotated = TRUE`)
- Verify health relevance scores periodically

### 4. Bias Detection Accuracy
- Combine MMLU-Lite with custom health questionnaire
- Use CS (Culturally Sensitive) samples for bias testing
- Use CA (Culturally Agnostic) samples as baseline

---

## Troubleshooting

### Issue: Empty annotation fields

**Problem:** Some samples have empty `culture`, `region`, or `country` fields.

**Solution:**
```python
# Filter for well-annotated samples
def is_well_annotated(sample: Dict) -> bool:
    culture = ast.literal_eval(sample.get('culture', '[]'))
    region = ast.literal_eval(sample.get('region', '[]'))
    return len(culture) > 0 and len(region) > 0 and sample.get('is_annotated', False)

# Use in queries
well_annotated = [s for s in samples if is_well_annotated(s)]
```

### Issue: Inconsistent translations

**Problem:** Some languages may have translation quality issues.

**Solution:**
- Focus on the 15 languages from original Global-MMLU (exclude Burmese if needed)
- Cross-validate with native speakers
- Report issues to Cohere Labs community

### Issue: Performance with large datasets

**Problem:** Loading all 16 languages (6,400 samples) is slow.

**Solution:**
```python
# Load incrementally
async def load_incrementally(languages: List[str], batch_size: int = 100):
    for lang in languages:
        dataset = load_dataset("CohereLabs/Global-MMLU-Lite", lang, streaming=True)
        batch = []
        
        for sample in dataset['test']:
            batch.append(sample)
            
            if len(batch) >= batch_size:
                await insert_batch(batch)
                batch = []
        
        if batch:
            await insert_batch(batch)
```

---

## Summary

BiasGuard's integration with Global-MMLU-Lite provides:

✅ **16-language coverage** for global health AI testing  
✅ **Cultural sensitivity labels** for targeted bias detection  
✅ **Rich geographic annotations** for heatmap generation  
✅ **Professional quality** human-translated data  
✅ **Scalable architecture** with caching and indexing  

This foundation enables BiasGuard to detect systemic bias that would be impossible to identify manually.
