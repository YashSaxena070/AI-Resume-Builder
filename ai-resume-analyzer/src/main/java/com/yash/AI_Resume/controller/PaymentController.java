package com.yash.AI_Resume.controller;

import com.razorpay.RazorpayException;
import com.yash.AI_Resume.document.Payment;
import com.yash.AI_Resume.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import static com.yash.AI_Resume.utils.AppConstants.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(PAYMENT)
@Slf4j
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping(CREATE_ORDER)
    public ResponseEntity<?> createOrder(@RequestBody Map<String, String> request, Authentication authentication)
            throws RazorpayException {
        // 0.Validate the request
        String planType = request.get("planType");
        if (!PREMIUM.equals(planType)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid plan type"));
        }

        // 1. call teh service method
        Payment payment = paymentService.createOrder(authentication.getPrincipal(), planType);

        // 2. prepare the response object
        Map<String, Object> response = Map.of(
                "receipt", payment.getReceipt(),
                "currency", payment.getCurrency(),
                "amount", payment.getAmount(),
                "orderId", payment.getRazorpayOrderId());

        // 3. return the response
        return ResponseEntity.ok(response);
    }

    @PostMapping(VERIFY)
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> request) throws RazorpayException {
        // 1. Validate the request
        String razorpayOrderId = request.get("razorpay_order_id");
        String razorpayPaymentId = request.get("razorpay_payment_id");
        String razorpaySignature = request.get("razorpay_signature");

        if (Objects.isNull(razorpayOrderId) ||
                Objects.isNull(razorpayPaymentId) ||
                Objects.isNull(razorpaySignature)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Missing required payment parameters"));
        }

        // 2.Call the service method
        boolean isValid = paymentService.verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);

        // 3. return the response
        if (isValid) {
            return ResponseEntity.ok(Map.of(
                    "message", "Payment verified successfully",
                    "status", "success"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", "Payment verification failed"));
        }
    }

    @GetMapping(HISTORY)
    public ResponseEntity<?> getPaymentHistory(Authentication authentication) {
        // Step 1: Call the service
        List<Payment> payments = paymentService.getUserPayments(authentication.getPrincipal());

        // Step 2: return the response
        return ResponseEntity.ok(payments);
    }

    @GetMapping(ORDER_DETAILS)
    public ResponseEntity<?> getOrderDetails(@PathVariable String orderId) {
        // 1. Call the service method
        Payment paymentDetails = paymentService.getPaymentDetails(orderId);

        // 2. return response
        return ResponseEntity.ok(paymentDetails);

    }

    @GetMapping("/key")
    public ResponseEntity<?> getRazorpayKey() {
        return ResponseEntity.ok(Map.of("key", paymentService.getRazorpayKey()));
    }

}
