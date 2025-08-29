FROM python:3.11-slim
WORKDIR /app
COPY pyproject.toml poetry.lock ./
RUN pip install --no-cache-dir poetry \ 
    && poetry config virtualenvs.create false \ 
    && poetry install --no-interaction --no-ansi --no-root
COPY app ./app
EXPOSE 9001
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "9001"]
