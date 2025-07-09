import streamlit as st
import redis
import json
import pandas as pd
import plotly.graph_objects as go
from datetime import datetime

# Redis connection
r = redis.Redis(
    host="redis-19322.c239.us-east-1-2.ec2.redns.redis-cloud.com",
    port=19322,
    password="gjUe5G9dU7mvAbSo8EAYPmkVmS8nsI1L",
    decode_responses=True
)

st.set_page_config(
    page_title="Khajindaar AI Trading Dashboard",
    layout="wide"
)

st.title("📈 Khajindaar AI: Real-Time Trading Dashboard")
st.write("Real-time Nifty 50, BankNIFTY, and Sensex live candlestick charts with Redis persistence.")

# Helper: Load recent ticks
def load_ticks(redis_key):
    raw_ticks = r.lrange(redis_key, -500, -1)
    if not raw_ticks:
        return pd.DataFrame()
    records = [json.loads(x) for x in raw_ticks]
    df = pd.DataFrame(records)
    df["time"] = pd.to_datetime(df["time"])
    return df

# Helper: Plot candlestick
def plot_candlestick(df, title):
    if df.empty:
        st.warning(f"No data found for {title}.")
        return
    df_resampled = df.resample("1min", on="time").ohlc()["price"].dropna()
    fig = go.Figure(data=[
        go.Candlestick(
            x=df_resampled.index,
            open=df_resampled["open"],
            high=df_resampled["high"],
            low=df_resampled["low"],
            close=df_resampled["close"]
        )
    ])
    fig.update_layout(
        title=title,
        yaxis_title="Price",
        xaxis_title="Time",
        xaxis_rangeslider_visible=False
    )
    st.plotly_chart(fig, use_container_width=True)

# Load data
nifty_df = load_ticks("nifty50_ticks")
bank_df = load_ticks("banknifty_ticks")
sensex_df = load_ticks("sensex_ticks")

# Show tick counts
st.success(f"✅ Collected ticks: Nifty50={len(nifty_df)} | BankNIFTY={len(bank_df)} | Sensex={len(sensex_df)}")

# Layout in columns
col1, col2 = st.columns(2)
with col1:
    st.subheader("Recent Nifty 50 Ticks")
    st.dataframe(nifty_df.tail(10).sort_values("time", ascending=False))

with col2:
    st.subheader("Recent BankNIFTY Ticks")
    st.dataframe(bank_df.tail(10).sort_values("time", ascending=False))

st.subheader("Recent Sensex Ticks")
st.dataframe(sensex_df.tail(10).sort_values("time", ascending=False))

# Show candlestick charts
plot_candlestick(nifty_df, "Nifty 50 Live Candlestick Chart")
plot_candlestick(bank_df, "BankNIFTY Live Candlestick Chart")
plot_candlestick(sensex_df, "Sensex Live Candlestick Chart")
