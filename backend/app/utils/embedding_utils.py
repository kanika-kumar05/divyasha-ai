from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

model = SentenceTransformer("all-MiniLM-L6-v2")

dimension = 384
index = faiss.IndexFlatL2(dimension)

memory_store = []


def create_embedding(text):
    embedding = model.encode([text])

    return np.array(
        embedding,
        dtype="float32"
    )


def add_memory(chat_id, text):
    embedding = create_embedding(text)

    index.add(embedding)

    memory_store.append({
        "chat_id": chat_id,
        "text": text
    })


def search_memory(query, top_k=3):

    if len(memory_store) == 0:
        return []

    query_embedding = create_embedding(query)

    actual_top_k = min(top_k, len(memory_store))

    distances, indices = index.search(
        query_embedding,
        actual_top_k
    )

    results = []
    seen_ids = set()

    for idx in indices[0]:

        if idx == -1:
            continue

        if idx >= len(memory_store):
            continue

        memory = memory_store[idx]

        if memory["chat_id"] not in seen_ids:
            results.append(memory)
            seen_ids.add(memory["chat_id"])

    return results