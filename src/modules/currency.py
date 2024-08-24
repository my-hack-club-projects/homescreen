from flask import Blueprint, request
import requests, time

currency = Blueprint('currency', __name__)
exchange_rates = {} # EUR as a base
exchange_rates_last_updated = 0
exchange_rates_update_interval = 3600

def fetch_exchange_rates():
    global exchange_rates, exchange_rates_last_updated

    response = requests.get("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json")
    exchange_rates = response.json().get('eur')

@currency.route('/currency/all')
def all():
    return [
        { "name": "USD" },
        { "name": "EUR" },
        { "name": "GBP" },
    ]

@currency.route('/currency/convert')
def convert():
    global exchange_rates, exchange_rates_last_updated

    _from = request.args.get('from').lower()
    _to = request.args.get('to').lower()
    _value = request.args.get('value')

    if time.time() - exchange_rates_last_updated > exchange_rates_update_interval:
        fetch_exchange_rates()
        exchange_rates_last_updated = time.time()

    # We only use one table to keep everything as much offline as possible
    # First, convert the value to EUR, then convert it to the target currency
    value_in_eur = float(_value) / exchange_rates.get(_from)
    value_in_target = value_in_eur * exchange_rates.get(_to)

    return {
        "success": True,
        "data": value_in_target
    }