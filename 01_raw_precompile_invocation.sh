# Configuration

RPC_URL=$RPC_URL_ENV
PRIVATE_KEY=$PRIVATE_KEY_ENV
PRECOMPILE_ADDR="0x0000000000000000000000000000000000000002"
INPUT_DATA="0x68656c6c6f" # The string "hello" in hex

# To call SHA256 precompile
TX_HASH=$(cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY $PRECOMPILE_ADDR $INPUT_DATA --legacy --gas-limit 30000 --value 0 --json | jq -r '.transactionHash')

# To get result
RESULT=$(cast call --rpc-url $RPC_URL $PRECOMPILE_ADDR $INPUT_DATA)

# To get block number from transaction receipt
BLOCK_NUMBER=$(cast rpc --rpc-url $RPC_URL eth_getTransactionReceipt $TX_HASH | jq -r '.blockNumber')

# To save to results.json
jq -n --arg tx "$TX_HASH" --arg result "$RESULT" --arg block "$BLOCK_NUMBER" '{"stage1": {"tx_hash": $tx, "output": $result, "block_number": $block}}' > results.json

echo "Transaction Hash: $TX_HASH"
echo "Output: $RESULT"
echo "Block Number: $BLOCK_NUMBER"