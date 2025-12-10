import React from 'react';
import axios from 'axios';

export default function RepaymentButton({loanId, amount, onSuccess, onError}){
  const handleRepay = async () => {
    try {
      await axios.post(`/api/loans/${loanId}/repay?amount=${amount}`);
      onSuccess && onSuccess();
    } catch (e) {
      onError && onError(e);
    }
  }

  return (
    <button onClick={handleRepay} className="px-3 py-2 bg-blue-600 text-white rounded">Repay {amount}</button>
  )
}
