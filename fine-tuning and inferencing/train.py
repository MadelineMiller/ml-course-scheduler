import pandas as pd
from transformers import T5Tokenizer, T5ForConditionalGeneration, Trainer, TrainingArguments
from datasets import Dataset

## Overall flow:
# We first generate prompt/expected_output pair based on our data
# We then fine-tune the model with this data

## generative model
# predicts on what it learned
# capable of inferencing the relationship between e.g., key words
# attention mechanism can look back and see the previously provided info and make an inference
# a course schedule has dependencies and order between courses
# a transformer model is good for this because it has this attention mechanism
# to pick up on these prereq requirements to generate new schedules

file_path = 'cleaned_schedule_with_cumulative_score.csv'
data = pd.read_csv(file_path)

# (1) data cleaning from data_cleaning.ipynb
# we have a lot of missing professor values
# data imputation is not possible for professor names and goodness scoring

# (2) preprocessing for the model
# model takes only plain text
# needed to concatenate the data 
# prompt, answer
def create_prompt_output_pair(row):
    """ does preprocessing
    """
    # extracts cumulative score from df
    cumulative_score = row['cumulative_score']
    # prompt is fixed for every single training step
    # note: cumulative score should be >0, should normalize negative score
    prompt = f"Generate a 12-quarter schedule maximizing goodness score. Target cumulative goodness score: {cumulative_score}."
    # 12 iterations
    # extracting each row and concatenate into a single string for embedding
    # before feeding it into the tokenizer
    output_text = ""
    for q in range(1, 13):
        courses = row[f'courses_q{q}']
        score = row[f'score_q{q}']
        if isinstance(courses, list):
            courses = ", ".join(courses)
        # e.g., "Quarter 1: Math 19ACSE20. Score: 2.33."
        # note: course, professor pair as future work
        output_text += f"Quarter {q}: {courses}. Score: {score}. "
    # prompt: question, output_text: answer (provdied course schedule)
    # teaching the model to do the expected behavior 
    # feed question, answer pair into the model saying this is what you should generate
    # after the model consumes enough training datasets, then we ask the model to generate its own schedules
    return prompt, output_text 

data[['prompt', 'output_text']] = data.apply(lambda row: pd.Series(create_prompt_output_pair(row)), axis=1)

dataset = Dataset.from_pandas(data[['prompt', 'output_text']])

train_test_split = dataset.train_test_split(test_size=0.1)
train_dataset = train_test_split["train"]
eval_dataset = train_test_split["test"] # 10% of dataset

# the model is small, which could impact model performace
# has only 60 million params, very small language model

# we are fine-tuning a pretrained model called T5 small 
# can already do inferencing 
# note: could experiment w/using Bart or GPT-3 or Llama 3.1
model_name = "t5-small"
tokenizer = T5Tokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)

# (3) do the preprocessing and feed the preprocessed data into the tokenizer
# convert the human readable language into the language that the model can read
# encoding the text string into the embeddings, which is what the token
def preprocess_data(examples):
    # optimally, we want to have a fixed length for the input, which is why we have padding
    # if the input is too long, it is truncated
    model_inputs = tokenizer(examples["prompt"], max_length=128, padding="max_length", truncation=True)
    labels = tokenizer(examples["output_text"], max_length=512, padding="max_length", truncation=True)
    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

# batched to speed up the processing
train_dataset = train_dataset.map(preprocess_data, batched=True)
eval_dataset = eval_dataset.map(preprocess_data, batched=True)

# config of the training process
training_args = TrainingArguments(
    output_dir="./results", # save results in this directory
    evaluation_strategy="epoch",
    learning_rate=5e-5,
    per_device_train_batch_size=8, # can be changed depending on resource, increase if using GPU
    per_device_eval_batch_size=8, # can be changed depending on resource, increase if using GPU
    num_train_epochs=2, # could increase if have more time, change to 5 and run overnight
    weight_decay=0.01, # Adam optimizer
    save_strategy="epoch",
    logging_dir="./logs",
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

trainer.train()


### inference.ipynb

# inference stage
# using the fine-tuned model
# now we are asking the model for an output, e.g., student schedule
# looking back at what we did in fine-tuning
# do a low temp because we want the model to be more deterministic

### results

# checkpoint are like weight matrix in NN
# results/checkpoint-1125/model.safetensors



# order:
# first run data_cleaning.ipynb to clean the data
# train.py to fine tune the pretrained model
# inference.ipynb to get an output of a schedule 
