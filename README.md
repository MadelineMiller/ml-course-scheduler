# Course Scheduling Planner Using Deep Learning

## Project Overview

This project aims to build an intelligent course scheduling system that optimizes students' academic schedules based on **RateMyProfessor reviews, prerequisites, and major requirements**. By leveraging **deep learning and sentiment analysis**, the system will recommend **optimal quarterly schedules** that maximize both academic success and student satisfaction.

---

## Professor & Course Ratings Data (CSV Format)

```csv
Computer Science and Engineering,Fall24,CSE40,Lise Getoor,Section 01,4.3,3.9,124,447574.0,"['Hilarious', 'Amazing lectures', 'Respected']"
```

## User Preferences (Example Tags)

```diff
Student Preferences (ranked in order of importance):  
- Clear Grading Criteria  
- No Group Projects  
- Amazing Lectures  
```

---

## 3. Methodology

We explored two approaches to **generating schedules**:

### 3.1 Transformer Model

We used a **sequence-to-sequence transformer model** to capture relationships between **preferences and schedule attributes**.

- **Model Chosen**: `T5-Small` from **Hugging Face**
- **Training Data**:  
  - 500 manually created sample schedules  
  - Course preference tags (e.g., *"Extra Credit"*, *"Clear Lectures"*)  
- **Evaluation**: Model performance was assessed based on **schedule alignment with preferences**.

### 3.2 Prompt Engineering

We experimented with **Flan-T5** and **ChatGPT API**:

- **Flan-T5**: Free, smaller, limited input size (5,012 tokens).
- **ChatGPT**: Larger input size, paid version required.

#### Prompt Engineering Strategies:

1. **One-Shot Learning**  
   - Included an example schedule and student preferences.
2. **Chain-of-Thought Prompting**  
   - Asked the model to list prerequisites, assign professors, and verify schedules step-by-step.

---

## 4. Results

We evaluated **three methodologies**:

| Approach                    | Avg. Evaluation Score |
|-----------------------------|----------------------|
| **Transformer Model**       | 3.3                  |
| **One-Shot Prompting**      | 3.4                  |
| **Chain-of-Thought Prompting** | **3.5**          |

- **Transformer Model**: **Limited variability**, repeated course selections.
- **One-Shot Prompting**: **Better alignment** to preferences, **less repetition**.
- **Chain-of-Thought Prompting**: **Highest score**, **most diverse schedules**, **better adaptability**.

---

## 5. Limitations & Future Work

### 5.1 General Limitations

- **Limited course data** (only next academic year's offerings available).
- **No access to historical student schedules** for training.
- **Does not account for course timings** (as they are published late).

### 5.2 Cost vs. Input Size

- **Flan-T5** had input limitations.
- **ChatGPT** provided better results but required **a paid version**.

### 5.3 Future Improvements

- **Expand to other majors** beyond Computer Science.
- **Consider real-time adjustments** to preferences.
- **Integrate reinforcement learning** for better optimization.

---

## 6. Conclusion

Our project demonstrated the potential of **deep learning and prompt engineering** in personalized course scheduling. 

- **Chain-of-thought prompting** produced the **most robust and adaptable schedules**.
- **Future improvements** could integrate **reinforcement learning and real-time adjustments**.

Beyond academic scheduling, our work has **broader applications** in:

- **Resource allocation**
- **Online learning course planning**
- **Personalized recommendation systems**

---

## 7. Team Member Contributions

| Team Member       | Contribution |
|------------------|-------------|
| **Cheryl Chuang**  | Managed project timeline, explored prompt engineering. |
| **Madeline Miller** | Scraped UCSC course data, implemented transformer model. |
| **Marianne Chuang** | Conducted research on prompt engineering techniques. |
| **Nell Brodkin** | Evaluated models, contributed to website backend. |
| **Sarah Xie** | Scraped RateMyProfessor data, built website frontend/backend. |

---

## 8. Appendix

### 8.1 GitHub Repository

🔗 **[Project Repository](https://github.com/MadelineMiller/ml-course-scheduler)**

---

🎓 **This project showcases the intersection of deep learning and educational planning, contributing to the future of intelligent academic advising!**
