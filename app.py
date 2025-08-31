import os
from dotenv import load_dotenv
import streamlit as st
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

st.set_page_config(page_title="AI Companion", page_icon="🤖")
st.title("🤖 AI Companion")

# simple chat history
if "msgs" not in st.session_state:
    st.session_state.msgs = [
        {"role": "system",
         "content": "You are an AI personal companion and life coach. Be concise, practical, and supportive."}
    ]

user_input = st.text_input("Ask me anything:")

if user_input:
    st.session_state.msgs.append({"role": "user", "content": user_input})

    with st.spinner("Thinking..."):
        resp = client.chat.completions.create(
            model="gpt-5",
            messages=st.session_state.msgs,
        )
        answer = resp.choices[0].message.content
        st.session_state.msgs.append({"role": "assistant", "content": answer})

# render last answer
for m in st.session_state.msgs:
    if m["role"] == "assistant":
        st.write("### 💡 Response:")
        st.write(m["content"])
