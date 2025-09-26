// mpesa_token.go
package mpesa

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type oauthResp struct {
	AccessToken string `json:"access_token"`
	ExpiresIn   string `json:"expires_in"`
}

func GetAccessToken() (string, error) {
	consumer := os.Getenv("MPESA_CONSUMER_KEY")
	secret := os.Getenv("MPESA_CONSUMER_SECRET")
	url := os.Getenv("MPESA_OAUTH_URL") // sandbox or prod

	req, _ := http.NewRequest("GET", url, nil)
	req.SetBasicAuth(consumer, secret)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
	
