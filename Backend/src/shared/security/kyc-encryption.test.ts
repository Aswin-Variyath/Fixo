import test from "node:test";
import assert from "node:assert/strict";
import {
  encryptKycData,
  decryptKycData,
} from "./kyc-encryption";

test("encrypts and decrypts KYC data", () => {
  const original = Buffer.from("Fixo test document");

  const encrypted = encryptKycData(original);

  console.log("Original length:", original.length);
  console.log("Encrypted length:", encrypted.length);
  console.log("Expected length:", original.length + 28);
  console.log("Encrypted buffer:", encrypted);

  assert.equal(encrypted.length, original.length + 28);

  const decrypted = decryptKycData(encrypted);

  assert.notDeepEqual(encrypted, original);
  assert.deepEqual(decrypted, original);
});

test("uses a different IV for each encryption", () => {
  const original = Buffer.from("Fixo test document");

  const first = encryptKycData(original);
  const second = encryptKycData(original);

  assert.notDeepEqual(first, second);
});

test("rejects tampered encrypted data", () => {
  const original = Buffer.from("Fixo test document");
  const encrypted = encryptKycData(original);

  // Change a byte in the ciphertext.
  encrypted[encrypted.length - 1] ^= 1;

  assert.throws(
    () => decryptKycData(encrypted),
    { message: "Unable to decrypt KYC data" },
  );
});
