import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import redis
import json

# App title and description
st.set_page_config(page_title="Khajindaar AI Trading Dashboard", layout="wide")

st.title("📈 Khajindaar AI: Real-Time Trading Dashboard")
st.markdown("Real-time Nifty 50 live candlestick chart with Redis persistence.")

# Redis connection
REDIS_HOST = "redis-19322.c239.us-east-1-2.ec2.cloud.redislabs.com"
REDIS_PORT = 19322
REDIS_PASSWORD = "gjUe5G9dU7mvAbSo8EAYPmkVmS8nsI1L"  # Replace with your real password

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, password=REDIS_PASSWORD, decode_responses=True)

# Auto-refresh every 5 seconds
st_autorefresh(interval=5000, key="refresh")

# Load data
data = r.lrange("nifty50_ticks", 0, -1)
if data:
    ticks = [json.loads(item) for item in data]
    df = pd.DataFrame(ticks)
    df["time"] = pd.to_datetime(df["time"])

    # Show tick count
    st.success(f"✅ Collected ticks: {len(df)}")

    # Show recent ticks
    st.subheader("Recent Nifty 50 Ticks")
    st.dataframe(df.sort_values("time", ascending=False).head(20), use_container_width=True)

    # Resample to candles
    df = df.set_index("time")
    candles = df["price"].resample("1Min").ohlc()

    if len(candles) < 2:
        st.info("Waiting for more data to build the candlestick chart...")
    else:
        # Candlestick chart
        st.subheader("Nifty 50 Live Candlestick Chart")
        fig = go.Figure(data=[
            go.Candlestick(
                x=candles.index,
                open=candles["open"],
                high=candles["high"],
                low=candles["low"],
                close=candles["close"],
                increasing_line_color="green",
                decreasing_line_color="red",
            )
        ])
        fig.update_layout(
            yaxis_title="Price",
            xaxis_title="Time",
            xaxis_rangeslider_visible=False,
            autosize=True,
            margin=dict(l=10, r=10, t=30, b=10),
        )
        fig.update_yaxes(
            autorange=True,
            fixedrange=False,
            tickformat=".2f",
        )
        st.plotly_chart(fig, use_container_width=True)

else:
    st.warning("No data found in Redis. Start your tick collector script to stream data here.")
