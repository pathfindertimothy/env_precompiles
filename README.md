# EVM_Precompiles

## Table of Contents

- [Requirements](#requirements)
- [To Run Scripts](#to-run-scripts)
- [End To End Test](#end-to-end-test)
- [Trouble Shoot](#trouble-shoot)

## Requirements

- Install the following
  - Kurtosis: `curl -L https://github.com/0xPolygon/kurtosis-cdk/releases/latest/download/install.sh | bash`
  - Foundry: `curl -L https://foundry.paradigm.xyz | bash`
  - Make sure jq, git and a shell are installed in your system
- To start cdk-erigon devnet:
  - Make sure docker is running
  - kurtosis run --enclave cdk github.com/0xPolygon/kurtosis-cdk@main
- Get RPC URL and funded account present in Kurtosis output
  - RPC: http://127.0.0.1:xxxx
  - Private Key
  - Funded account
  - Install NPM or Yarn
  - Ran `yarn` or `npm` to install the necessary node modules
- Add rpc_url of kurtosis in the `foundry.toml` file

## To Run Scripts

- To run Raw Precompile Invocation
  - Export private key and rpc url in bash
  - Run: sh `raw_precompile_invocation.sh`
  - The output result (stage1) will give the `Transaction Hash`, `Output` and `Block Number`
  - The output correspond to the SHA256 hash value of "hello". When computed using Python for example, the same output should be retrieved. 
  - Verdict: the output hash matches the SHA256 of the string "hello"

- To compile the contract
  - Run: `forge compile ECRecoverWrapper.sol`
  - Result: should compile successfully
  - Verdict: compiled successfully

- To deploy the contract
  - Run: `node 02_deploy.js`
  - Output: contract should deploy successfully with output values (stage2)
  - Verdict: deployed successfully

- To invoke the contract
  - Run: `node 03_invoke_contract.js`
  - Output: result in stage3 should have `Recovered Address` to be equal to `Expected Address`
  - Verdict: the `recovered address` matched the `expected address`

## End To End Test

- To ran end-to-end test
  - Run: `forge test --fork-url $(kurtosis port print cdk {node_service_name} rpc | grep -o 'http://[^ ]*')`
  - Verdict: all three tests ran and pass successfully

## Trouble Shoot

- Notes in case Kurtosis could not restart or having problem starting again, try the following
  - To check status of enclave: kurtosis enclave ls
  - To clean up the existing enclave: kurtosis enclave rm --force cdk
  - To clean up: kurtosis clean -a
  - After the above, run Kurtosis enclave command