package mpesa

import (
	"fmt"
	"os"
	"os/exec"
)

func InvokeSorobanCredit(userStellarAddress string, amount int, mpesaReceipt string) error {
	contractID := os.Getenv("SOROBAN_CONTRACT_ID")
	