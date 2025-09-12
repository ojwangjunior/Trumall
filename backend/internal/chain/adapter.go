package chain

import "errors"

type Adapter interface {
	CreateOnChainOrder(orderID string, amountCents int64, metadata map[string]interface{}) (txID string, err error)
	GetTxStatus(txID string) (string, error)
	VerifyProductAuthenticity(hash string) (bool, error)
}

type DummyAdapter struct{}

func (d DummyAdapter) CreateOnChainOrder(orderID string, amountCents int64, metadata map[string]interface{}) (string, error) {
	return "dummy-tx-" + orderID, nil
}

func (d DummyAdapter) GetTxStatus(txID string) (string, error) {
	return "confirmed", nil
}

func (d DummyAdapter) VerifyProductAuthenticity(hash string) (bool, error) {
	if hash == "" { return false, errors.New("no hash") }
	return true, nil
}
