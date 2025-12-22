# TrustMall Smart Contract Deployment Guide

## Contract Built Successfully!

Your compiled contract is located at:
`/home/malika/Trumall/soroban-contract/target/wasm32-unknown-unknown/release/trustmall_contract.wasm`

## Prerequisites

1. Install Soroban CLI (you'll need to install OpenSSL dev libraries first):
```bash
sudo apt-get update
sudo apt-get install libssl-dev pkg-config
cargo install --locked soroban-cli
```

2. Add soroban to your PATH:
```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

## Step 1: Configure Soroban for Testnet

```bash
# Configure the testnet network
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

## Step 2: Create/Import Identity

```bash
# Generate a new identity for deploying contracts
soroban keys generate --global trustmall-deployer --network testnet

# Get the public address
soroban keys address trustmall-deployer

# Fund the account via Friendbot (testnet faucet)
curl "https://friendbot.stellar.org?addr=$(soroban keys address trustmall-deployer)"
```

## Step 3: Deploy the Contract

```bash
cd /home/malika/Trumall/soroban-contract

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/trustmall_contract.wasm \
  --source trustmall-deployer \
  --network testnet
```

This will output a **Contract ID** - save this!

## Step 4: Update Backend Environment Variables

Edit `/home/malika/Trumall/backend/.env` and add:

```bash
# Soroban Configuration
SOROBAN_CONTRACT_ID=<your-contract-id-from-step-3>
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org:443
SOROBAN_SECRET_KEY=<your-secret-key-from-trustmall-deployer>
SOROBAN_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
```

To get your secret key:
```bash
soroban keys show trustmall-deployer
```

## Contract Functions

The TrustMall contract provides the following functions:

### Recording Functions
- `record_payment(order_id, amount_cents, currency, mpesa_receipt, status)` - Record payment transactions
- `record_order(order_id, buyer_id, store_id, total_cents, status)` - Record orders
- `update_order_status(order_id, new_status)` - Update order status
- `record_product(product_id, store_id, title, price_cents)` - Record products for authenticity
- `record_store(store_id, owner_id, name)` - Record store creation

### Query Functions
- `get_payment_count()` - Get total payments recorded
- `get_order_count()` - Get total orders recorded
- `get_product_count()` - Get total products recorded
- `get_store_count()` - Get total stores recorded
- `get_payment(index)` - Get payment by index
- `get_order(index)` - Get order by index
- `get_product(index)` - Get product by index
- `get_store(index)` - Get store by index

## Testing the Contract

Test a contract function:
```bash
soroban contract invoke \
  --id <your-contract-id> \
  --source trustmall-deployer \
  --network testnet \
  -- \
  get_payment_count
```

## Production Deployment

For production, repeat the same steps but use:
- RPC URL: `https://soroban-mainnet.stellar.org:443`
- Network passphrase: `Public Global Stellar Network ; September 2015`
- Fund your account with real XLM instead of using Friendbot

## Support

- Stellar Docs: https://developers.stellar.org/docs
- Soroban Docs: https://soroban.stellar.org/docs


 soroban contract invoke \                                                                  
     --id CATKZPSGHINIU7CPIV74CIYPQTOWE4CZ632XKQXRTPPDB56IWMLH7ZSI \                          
     --source-account trustmall-deployer \                                                    
     --network testnet \                                                                      
     -- \                                                                                     
     get_payment_count