FROM python:3.12.13-alpine3.23
RUN addgroup app && adduser -S -G app app
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN chown app:app /app
USER app
EXPOSE 8000
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000"]
