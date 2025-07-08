import streamlit as st
from kiteconnect import KiteTicker
from collections import deque
from datetime import datetime
import pandas as pd
import plotly.graph_objects as go
import threading
import time

API_KEY = "qitb8k0p5jqhko5y"
ACCESS_TOKEN = "T49Wf774g4I98dAgA2PG1rLa95nfdnmT"
NIFTY_TOKEN = 256265

st.set_page_config(
    page_title="Khajindaar AI: Real-Time Trading Dashboard",
    layout="wide"
)

st.image("khajindaar_logo.png", width=150)
st.title("📈 Khajindaar AI: Real-Time Trading Dashboard")

tick_buffer = deque(maxlen=500)
buffer_lock = threading.Lock()

kws = KiteTicker(API_KEY, ACCESS_TOKEN)

def on_ticks(ws, ticks):
    with buffer_lock:
        for tick in ticks:
            tick_time = tick["exchange_timestamp"]
            price = tick["last_price"]
            tick_buffer.append({"time": tick_time, "price": price})

def on_connect(ws, response):
    ws.subscribe([NIFTY_TOKEN])
    ws.set_mode(ws.MODE_FULL, [NIFTY_TOKEN])

def on_close(ws, code, reason):
    print("WebSocket closed:", code, reason)

def run_websocket():
    kws.on_ticks = on_ticks
    kws.on_connect = on_connect
    kws.on_close = on_close
    kws.connect(threaded=False)

t = threading.Thread(target=run_websocket, daemon=True)
t.start()

line_chart_placeholder = st.empty()
candle_chart_placeholder = st.empty()
data_table_placeholder = st.empty()
tick_count_placeholder = st.empty()

while True:
    with buffer_lock:
        if tick_buffer:
            df = pd.DataFrame(list(tick_buffer))
            df = df.sort_values("time").drop_duplicates(subset="time")

            tick_count_placeholder.write(f"✅ **Collected ticks:** {len(df)}")

            data_table_placeholder.dataframe(df.tail(10))

            line_chart_placeholder.line_chart(
                df.set_index("time")["price"]
            )

            df_resampled = df.set_index("time")["price"].resample("1Min").ohlc()

            fig = go.Figure(data=[go.Candlestick(
                x=df_resampled.index,
                open=df_resampled["open"],
                high=df_resampled["high"],
                low=df_resampled["low"],
                close=df_resampled["close"]
            )])
            fig.update_layout(
                xaxis_title="Time",
                yaxis_title="Price",
                title="Nifty 50 Live Candlestick Chart",
                height=500
            )
            candle_chart_placeholder.plotly_chart(
                fig,
                use_container_width=True,
                key=f"candle_{int(time.time())}"
            )
    time.sleep(3)
