This is a tool that takes an ETH address, having one or more validators, and outputs ETH income reports.

These "income reports" are simple `.csv` files.

The data used to generate these CSVs comes from [beaconcha.in](https://beaconcha.in)'s APIs.

Set the following environmental variables prior to running this tool:

```
VALIDATOR_ETHADDRESS=[validator's ETH address here]
BEACONCHAIN_APIKEY=[Beaconcha.in API key here]
```

(For example, create a file named `.env`, paste in those two lines, then replace the values with your ETH address and API key.)
