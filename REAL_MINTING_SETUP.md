# Real NFT Minting Setup Guide

## Current Status: ✅ Foundation Ready

The LearnFlow application now has the foundation for real NFT minting on Cardano! Here's what's implemented and what's needed for full production minting.

## What's Currently Working

✅ **Real Cardano wallet connections** (Lace, Nami, Eternl, etc.)  
✅ **Blockfrost API integration** for Cardano preprod network  
✅ **CIP-25 compliant metadata** generation  
✅ **Transaction preparation** and validation  
✅ **User interface** for minting workflow  

## What's Needed for Real Minting

### 1. Service Wallet Setup

The app needs a funded service wallet to pay for minting transactions:

```bash
# Generate a new wallet mnemonic (24 words)
# Store this securely - it controls the service wallet
```

**Environment Variable:**
- `SERVICE_WALLET_MNEMONIC`: 24-word mnemonic phrase for the service wallet

### 2. Fund the Service Wallet

1. **Get preprod ADA** from the Cardano testnet faucet
2. **Send to service wallet** address (generated from mnemonic)
3. **Minimum balance**: ~10 ADA for multiple minting transactions

### 3. Create Minting Policy

For real NFT minting, you need:

```javascript
// Example minting policy (time-locked)
const mintingPolicy = {
  type: "all",
  scripts: [
    {
      type: "sig",
      keyHash: "service_wallet_key_hash"
    },
    {
      type: "before", 
      slot: future_slot_number
    }
  ]
}
```

### 4. Complete Implementation

The current code has placeholders for:

- **Transaction building** using Lucid or CSL
- **Policy script creation**
- **Asset minting and sending**
- **Blockchain submission**

## Implementation Options

### Option A: Lucid Cardano (Recommended)

```typescript
import { Lucid, Blockfrost, fromText } from "lucid-cardano";

// Initialize Lucid
const lucid = await Lucid.new(
  new Blockfrost(blockfrostUrl, apiKey),
  "Preprod"
);

// Set service wallet
lucid.selectWalletFromSeed(mnemonic);

// Build and submit transaction
const tx = await lucid
  .newTx()
  .mintAssets({ [unit]: 1n })
  .attachMintingPolicy(policy)
  .attachMetadata(721, metadata)
  .payToAddress(userAddress, { [unit]: 1n })
  .complete();

const signedTx = await tx.sign().complete();
const txHash = await signedTx.submit();
```

### Option B: Cardano Serialization Library

```typescript
import * as CSL from "@emurgo/cardano-serialization-lib-nodejs";

// Build transaction using CSL
// More complex but more control
```

### Option C: Mesh SDK

```typescript
import { MeshWallet, BlockfrostProvider } from "@meshsdk/core";

// Alternative library for Cardano transactions
```

## Security Considerations

### Production Deployment

1. **Secure Key Management**
   - Use AWS KMS, Azure Key Vault, or similar
   - Never store mnemonics in plain text
   - Rotate keys regularly

2. **Rate Limiting**
   - Limit NFT minting per user
   - Implement cooldown periods
   - Monitor for abuse

3. **Validation**
   - Verify quiz scores server-side
   - Validate wallet addresses
   - Check for duplicate minting

### Environment Variables

```bash
# Required for real minting
BLOCKFROST_API_KEY=preprodl6Bq073Mz4aOgmuqnFglwG2cM7kBWVnm
SERVICE_WALLET_MNEMONIC=your_24_word_mnemonic_here

# Optional
IPFS_API_KEY=for_nft_images
POLICY_SCRIPT_PATH=path_to_policy_script
```

## Testing Workflow

1. **Set up service wallet** with preprod ADA
2. **Configure environment** variables
3. **Test wallet connection** via app
4. **Complete quiz** with perfect score
5. **Mint NFT** and verify in wallet
6. **Check transaction** on CardanoScan

## Production Checklist

- [ ] Service wallet funded with sufficient ADA
- [ ] Minting policy created and validated
- [ ] Environment variables configured securely
- [ ] Rate limiting implemented
- [ ] Error handling and logging added
- [ ] Transaction monitoring set up
- [ ] User wallet validation enhanced
- [ ] IPFS integration for NFT images
- [ ] Backup and recovery procedures

## Cost Estimation

**Per NFT Mint:**
- Transaction fee: ~0.2 ADA
- Min UTXO: ~1.5 ADA (returned with NFT)
- **Total cost per mint: ~0.2 ADA**

**For 1000 NFTs:** ~200 ADA (~$100-200 depending on ADA price)

## Next Steps

1. **Fund service wallet** with preprod ADA
2. **Implement real transaction building** using Lucid
3. **Test end-to-end** minting workflow
4. **Add error handling** and monitoring
5. **Deploy to production** with mainnet

The foundation is solid - you're just a few steps away from real NFT minting! 🚀
