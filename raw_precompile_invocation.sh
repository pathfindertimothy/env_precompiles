# Configuration
# RPC_URL="http://127.0.0.1:51923"
# PRIVATE_KEY="0xd1141494ebf665f87057af12ea53848ee1ae6dfb28b74eb89d56f0e3c78baacb"
RPC_URL=$RPC_URL_ENV
PRIVATE_KEY=$PRIVATE_KEY_ENV
PRECOMPILE_ADDR="0x0000000000000000000000000000000000000002"
INPUT_DATA="0x68656c6c6f" # The string "hello" in hex

# Call SHA256 precompile
TX_HASH=$(cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY $PRECOMPILE_ADDR $INPUT_DATA --legacy --gas-limit 30000 --value 0 --json | jq -r '.transactionHash')

# Get result
RESULT=$(cast call --rpc-url $RPC_URL $PRECOMPILE_ADDR $INPUT_DATA)

# Get block number from transaction receipt
BLOCK_NUMBER=$(cast rpc --rpc-url $RPC_URL eth_getTransactionReceipt $TX_HASH | jq -r '.blockNumber')

# Save to results.json
jq -n --arg tx "$TX_HASH" --arg result "$RESULT" --arg block "$BLOCK_NUMBER" '{"stage1": {"tx_hash": $tx, "output": $result, "block_number": $block}}' > results.json

echo "Transaction Hash: $TX_HASH"
echo "Output: $RESULT"
echo "Block Number: $BLOCK_NUMBER"


# Notes
# Key is from kurtosis output in the terminal interface
# Generating a new private key
# Command returned with exit code '0' and the following output: {key generated}
# 1a7fd8e116d7   op-el-1-op-geth-op-node-001: rpc=rpc: 8545/tcp -> http://127.0.0.1:51923