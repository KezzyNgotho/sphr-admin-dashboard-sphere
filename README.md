# SPHR Admin Dashboard

![Dashboard Preview](public/preview.png) 

A secure admin dashboard for managing SPHR Token and Exchange operations with role-based access control and Web3 integration.

## Features

- **Secure Authentication**
  - MetaMask/Web3 wallet integration
  - JWT/OAuth2 session management

- **SPHR Token Management**
  - Real-time metrics (supply, transfer status, paused state)
  - Mint/burn tokens
  - Toggle transferability/pause state
  - Role management (grant/revoke)

- **Exchange Management**
  - View reserves and exchange rates
  - Update decay factors and minimum rates
  - Manage reward reserves

- **Security & Auditing**
  - Role explorer with permission checks
  - Audit logs for all admin actions
  - Contract lifecycle controls

## Technologies Used

- **Frontend**: Next.js, React, TypeScript
- **State Management**: Redux/Recoil
- **Web3**: ethers.js, MetaMask API
- **Styling**: Tailwind CSS or Chakra UI
- **Testing**: Jest, React Testing Library
- **Security**: JWT, OAuth2

## Getting Started

### Prerequisites

- Node.js v16+
- Yarn or npm
- MetaMask browser extension
- Access to SPHR API endpoints

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KezzyNgotho/sphr-admin-dashboard.git
   cd sphr-admin-dashboard

   yarn install
    # or
npm install