FROM python:3.11.9-slim

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "backend.main:app", "--reload"]