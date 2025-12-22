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

/