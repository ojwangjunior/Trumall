// stk_push.go
package mpesa

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type StkRequest struct {
	BusinessShortCode string `json:"BusinessShortCode"`
	Password          string `json:"Password"`
	Timestamp         string `json:"Timestamp"`
	TransactionType   string `json:"TransactionType"`
	Amount            int    `json:"Amount"`
	PartyA            string `json:"PartyA"`
	PartyB            string `json:"PartyB"`
	PhoneNumber       string `json:"PhoneNumber"`
	CallBackURL       string `json:"CallBackURL"`
	AccountReference  string `json:"AccountReference"`
	TransactionDesc   string `json:"TransactionDesc"`
}

func InitiateSTK(phone string, amount int, accountRef, orderID string) (checkoutRequestID string, err error) {
	token, err := GetAccessToken()
	if err != nil {
		return "", err
	}

	shortcode := os.Getenv("MPESA_SHORTCODE")
	passkey := os.Getenv("MPESA_PASSKEY")
	// Kenya local time (important to match expected timestamp)
	loc, _ := time.LoadLocation("Africa/Nairobi")
	ts := time.Now().In(loc).Format("20060102150405")
	password := base64.StdEncoding.EncodeToString([]byte(shortcode + passkey + ts))

	