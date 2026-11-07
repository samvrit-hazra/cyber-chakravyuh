from groq import AsyncGroq
from app.core.config import settings

_client: AsyncGroq = None


def get_groq_client() -> AsyncGroq:
    global _client
    if _client is None:
        _client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _client


async def query_groq(prompt: str, system_message: str = "You are an elite cybersecurity threat analyst.", model: str = None) -> str:
    """
    Executes a structured query against Groq LLM using Llama-3 models.
    """
    if not settings.GROQ_API_KEY:
        return "AI analysis skipped: GROQ_API_KEY not configured."

    client = get_groq_client()
    chosen_model = model or settings.GROQ_MODEL

    try:
        chat_completion = await client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ],
            model=chosen_model,
            temperature=0.2,
            max_tokens=1024
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"AI analysis error: {str(e)}"
