import streamlit as st
import pandas as pd
import plotly.graph_objects as go
import redis
import threading
from kiteconnect import KiteTicker
from datetime import datetime
import time

# ========== REDIS CONNECTION ==========
r = redis.Redis(
    host='redis-19322.c239.us-east-1-2.ec2.redns.redis-cloud.com',
    port=19322,
    password='gjUe5G9dU7mvAbSo8EAYPmkVmS8nsI1L',
    decode_responses=True
)

# ========== KITE WEBSOCKET ==========
API_KEY = "qitb8k0p5jqhko5y"
ACCESS_TOKEN = "jnTMayuLsm25RvXxxrAFmOGjCnOjtdva"

kws = KiteTicker(API_KEY, ACCESS_TOKEN)

INSTRUMENT_TOKEN = 256265  # Nifty 50

# ========== STREAMLIT PAGE ==========
st.set_page_config(
    page_title="Khajindaar AI - Real-Time Trading Dashboard",
    layout="wide"
)

st.title("📈 Khajindaar AI: Real-Time Trading Dashboard")
st.markdown("Real-time Nifty 50 live candlestick chart with Redis persistence.")

# Placeholder for plot
chart_placeholder = st.empty()
table_placeholder = st.empty()
status_placeholder = st.empty()

# ========== TICK HANDLING ==========
def on_ticks(ws, ticks):
    tick = ticks[0]
    price = tick['last_price']
    ts = tick['exchange_timestamp'].strftime("%Y-%m-%d %H:%M:%S")

    # Store latest price in Redis
    r.set("latest_price", price)

    # Append to Redis list
    r.rpush("price_history", f"{ts},{price}")

    # Trim list to last 500 ticks
    r.ltrim("price_history", -500, -1)

def on_connect(ws, response):
    ws.subscribe([INSTRUMENT_TOKEN])
    ws.set_mode(ws.MODE_FULL, [INSTRUMENT_TOKEN])

def on_close(ws, code, reason):
    print("WebSocket closed:", code, reason)

kws.on_ticks = on_ticks
kws.on_connect = on_connect
kws.on_close = on_close

# ========== START WEBSOCKET THREAD ==========
def run_ws():
    kws.connect(threaded=False)

thread = threading.Thread(target=run_ws, daemon=True)
thread.start()

# ========== STREAMLIT LOOP ==========
while True:
    # Load last 50 ticks
    data = r.lrange("price_history", -50, -1)
    if data:
        records = [x.split(",") for x in data]
        df = pd.DataFrame(records, columns=["time", "price"])
        df["time"] = pd.to_datetime(df["time"])
        df["price"] = df["price"].astype(float)

        # Candlestick chart (1 min resample)
        df_resampled = df.set_index("time").resample("1min").ohlc()["price"].dropna()
        fig = go.Figure(
            data=[
                go.Candlestick(
                    x=df_resampled.index,
                    open=df_resampled["open"],
                    high=df_resampled["high"],
                    low=df_resampled["low"],
                    close=df_resampled["close"]
                )
            ]
        )
        fig.update_layout(
            title="Nifty 50 Live Candlestick Chart",
            xaxis_title="Time",
            yaxis_title="Price",
            xaxis_rangeslider_visible=False
        )
        chart_placeholder.plotly_chart(fig, use_container_width=True)

        # Show last 10 records
        table_placeholder.dataframe(df.tail(10))
        status_placeholder.success(f"✅ Collected ticks: {len(df)}")

    else:
        status_placeholder.info("⏳ Waiting for live data...")

    time.sleep(5)
