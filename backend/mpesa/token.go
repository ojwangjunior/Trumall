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
	