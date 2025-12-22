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

	cmd := exec.Command("soroban", "contract", "invoke",
		"--id", s.ContractID,
		"--source", s.SecretKey,
		"--rpc-url", s.RPCURL,
		"--network-passphrase", s.NetworkPassphrase,
		"--",
		"record_payment",
		"--order_id", orderID,
		"--amount_cents", fmt.Sprintf("%d", amountCents),
		"--currency", currency,
		"--mpesa_receipt", mpesaReceipt,
		"--status", status,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("soroban record_payment failed: %v - %s", err, string(output))
	}

	// Parse transaction hash from output
	txHash := strings.TrimSpace(string(output))
	return txHash, nil
}

// RecordOrder records an order on the blockchain
func (s *SorobanService) RecordOrder(orderID, buyerID, storeID string, totalCents int64, status string) (string, error) {
	if s.ContractID == "" || s.RPCURL == "" || s.SecretKey == "" {
		log.Println("Soroban not configured, skipping blockchain recording")
		return "", nil
	}

	cmd := exec.Command("soroban", "contract", "invoke",
		"--id", s.ContractID,
		"--source", s.SecretKey,
		"--rpc-url", s.RPCURL,
		"--network-passphrase", s.NetworkPassphrase,
		"--",
		"record_order",
		"--order_id", orderID,
		"--buyer_id", buyerID,
		"--store_id", storeID,
		"--total_cents", fmt.Sprintf("%d", totalCents),
		"--status", status,
	)

	output, err := cmd.CombinedOutput()
	if err != nil {
		return "", fmt.Errorf("soroban record_order failed: %v - %s", err, string(output))
	}

	txHash := strings.TrimSpace(string(output))
	return txHash, nil
}

// UpdateOrderStatus updates an order status on the blockchain
func (s *SorobanService) UpdateOrderStatus(orderID, newStatus string) (string, error) {
	if s.ContractID == "" || s.RPCURL == "" || s.SecretKey == "" {
		log.Println("Soroban not configured, skipping blockchain recording")
		return "", nil
	}

	cmd := exec.Command("soroban", "contract", "invoke",
		"--id", s.ContractID,
		"--source", s.SecretKey,
		"--rpc-url", s.RPCURL,
		"--network-passphrase", s.NetworkPassphrase,
		