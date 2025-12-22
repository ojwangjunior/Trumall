package services

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
)

type SorobanService struct {
	ContractID        string
	RPCURL            string
	SecretKey         string
	NetworkPassphrase string
}

func NewSorobanService() *SorobanService {
	return &SorobanService{
		ContractID:        os.Getenv("SOROBAN_CONTRACT_ID"),
		RPCURL:            os.Getenv("SOROBAN_RPC_URL"),
		SecretKey:         os.Getenv("SOROBAN_SECRET_KEY"),
		NetworkPassphrase: os.Getenv("SOROBAN_NETWORK_PASSPHRASE"),
	}
}

// RecordPayment records a payment transaction on the blockchain
func (s *SorobanService) RecordPayment(orderID string, amountCents int64, currency string, mpesaReceipt string, status string) (string, error) {
	if s.ContractID == "" || s.RPCURL == "" || s.SecretKey == "" {
		log.Println("Soroban not configured, skipping blockchain recording")
		return "", nil
	}

	