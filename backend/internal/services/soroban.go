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
