package mpesa

import (
	"fmt"
	"os"
	"os/exec"
)

func InvokeSorobanCredit(userStellarAddress string, amount int, mpesaReceipt string) error {
	contractID := os.Getenv("SOROBAN_CONTRACT_ID")
	rpcURL := os.Getenv("SOROBAN_RPC_URL")
	secret := os.Getenv("SOROBAN_SECRET_KEY")
	network := os.Getenv("SOROBAN_NETWORK_PASSPHRASE")

	// Example: invoke contract function `contribute` that expects (address, amount, memo)
	cmd := exec.Command("soroban", "invoke",
		"--id", contractID,
		"--fn", "contribute",
		"--arg", userStellarAddress,
		"--arg", fmt.Sprintf("%d", amount),
		"--arg", mpesaReceipt,
		"--secret-key", secret,
		"--rpc-url", rpcURL,
		"--network-passphrase", network,
	)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return fmt.Errorf("soroban invoke failed: %v - %s", err, string(out))
	}
	// parse output if needed
	return nil
}
