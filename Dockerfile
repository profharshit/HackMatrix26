FROM node:22-slim

# Python for the FastAPI brain, build tools in case better-sqlite3 must compile
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv python-is-python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY backend/requirements.txt backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY gateway/package.json gateway/package-lock.json gateway/
RUN cd gateway && npm ci --omit=dev

COPY backend backend
COPY gateway gateway
COPY scripts scripts
COPY start.sh start.sh

# The volume hides /app/data, so the schema is kept here and copied in at startup
COPY data/schema.sql /app/seed/schema.sql

ENV PORT=8080
EXPOSE 8080
CMD ["bash", "start.sh"]