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

	reqBody := StkRequest{
		BusinessShortCode: shortcode,
		Password:          password,
		Timestamp:         ts,
		TransactionType:   "CustomerPayBillOnline",
		Amount:            amount,
		PartyA:            phone, // payer MSISDN in format 2547XXXXXXXX
		PartyB:            shortcode,
		PhoneNumber:       phone,
		CallBackURL:       os.Getenv("MPESA_CALLBACK_URL"),
		AccountReference:  accountRef,
		TransactionDesc:   fmt.Sprintf("Trumall order %s", orderID),
	}

	b, _ := json.Marshal(reqBody)
	url := os.Getenv("MPESA_STK_URL") // sandbox/prod endpoint
	req, _ := http.NewRequest("POST", url, bytes.NewReader(b))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 15 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	// Example response contains CheckoutRequestID and MerchantRequestID
	var r map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&r); err != nil {
		return "", err
	}

	if resp.StatusCode != 200 {
		return "", fmt.Errorf("mpesa stk push error: %v", r)
	}
	if val, ok := r["CheckoutRequestID"].(string); ok {
		return val, nil
	}
	// Older responses nest it inside response? adjust as needed
	if res, ok := r["Response"].(map[string]interface{}); ok {
	
