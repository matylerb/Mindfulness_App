import os
from dotenv import load_dotenv
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load environment variables
load_dotenv()


try:
    groq_api_key = os.environ["GROQ_API_KEY"]
    mindfulness_teacher_llm = ChatGroq(
        api_key=groq_api_key,
        model="llama-3.1-8b-instant", 
        temperature=0.3, #creative writing
        max_retries=2,
    )
except KeyError:
    print("Error: GROQ_API_KEY not found in environment variables.")
    print("Please make sure you have a .env file with GROQ_API_KEY=your_key")
    exit() # Exit if the API key is missing

# DuckDuckGo will look for relevant mindful stuff
mindfulness_search = DuckDuckGoSearchRun()

def find_mindfulness_resources(user_intention: str) -> str:
    """Search for mindfulness practices or wisdom based on user's intention."""
    #Instead of specific URLs, search for general information related to the feeling/need
    search_queries = [
        f"mindfulness exercises for {user_intention}",
        f"breathing techniques for {user_intention}",
        f"short guided meditation for {user_intention}",
        f"quotes about finding peace when {user_intention}",
    ]

    all_search_results = ""
    print(f"\nOkay, I understand you're seeking a moment of peace related to '{user_intention}'.")
    print("Let me gently search for some relevant resources...")

    #Try a few searches to gather different perspectives
    for query in search_queries:
        try:
            print(f"Searching for: {query}")
            results = mindfulness_search.run(query)
            if results:
                all_search_results += f"--- Results for '{query}' ---\n{results[:1500]}\n\n" # Limit results length
        except Exception as e:
            print(f"Could not complete search for '{query}': {str(e)}")

    if not all_search_results:
        return "No specific online resources were found." # Return a simple message if search fails

    return all_search_results

def generate_mindfulness_guidance(user_intention: str, search_info: str) -> str:
    """Synthesize search info and user intention into compassionate guidance."""

    #The LLM's system message defines its persona and task
    system_message_content = """
    You are a gentle, calm, and compassionate mindfulness teacher.
    Your purpose is to help the user find a moment of peace, focus, or calm based on their current state or intention.
    You will be given the user's stated intention (e.g., "feeling stressed", "need focus") and some search results related to it.

    Your task is to:
    1. Acknowledge the user's feeling or intention with kindness.
    2. Based on the provided information and your own knowledge, suggest a simple mindfulness practice or offer some calming words or wisdom.
    3. If suggesting a practice (like breathing or a short meditation), explain it simply and gently. Keep it brief and easy to follow.
    4. If the search results weren't very helpful, rely on general mindfulness principles (like focusing on the breath, noticing senses, or acknowledging thoughts without judgment).
    5. Maintain a consistently calm, soothing, and encouraging tone throughout your response.
    6. Avoid technical jargon or complex instructions.
    7. Your response should be encouraging and supportive, offering a moment of respite.
    """

    # The Human message provides the context for the teacher
    human_message_content = f"""
    The user is seeking guidance because they are feeling or needing: "{user_intention}".

    Here is some information I found that might be relevant:
    {search_info}

    Please offer gentle guidance or a simple practice to help them find a moment of peace.
    """

    messages = [
        SystemMessage(content=system_message_content),
        HumanMessage(content=human_message_content)
    ]

    print("\nNow, let me gather the information and offer some guidance...")
    try:
        ai_msg = mindfulness_teacher_llm.invoke(messages)
        return ai_msg.content
    except Exception as e:
        return f"I apologize, I couldn't generate the guidance just now. Please try again later. ({str(e)})"


def guide_mindfulness_moment(user_intention: str):
    """Orchestrates finding resources and generating guidance."""
    print("\nWelcome. Take a gentle breath. I am here to help you find a moment of calm.")

    # Step 1: Find potential resources based on the user's need
    raw_info = find_mindfulness_resources(user_intention)

    # Step 2: Use the LLM (the teacher) to synthesize and guide
    final_guidance = generate_mindfulness_guidance(user_intention, raw_info)

    return final_guidance

app = Flask(__name__)
CORS(app)

@app.route('/mindfulness', methods=['POST'])
def mindfulness_endpoint():
    data = request.get_json()
    user_intention = data.get('intention', '')
    if not user_intention:
        return jsonify({'error': 'Intention is required'}), 400

    guidance = guide_mindfulness_moment(user_intention)
    return jsonify({'guidance': guidance})

if __name__ == "__main__":
    app.run(debug=True)