# CivicVote – Modern Multi-Color Web Client

An interactive, responsive, multi-color digital voting interface built with React, Vite, and Lucide icons, connecting directly with the **CivicVote Spring Boot 3 Microservices Platform** through the Spring Cloud API Gateway (`http://localhost:8080`).

---

## 🎨 Visual Design System & Palette

CivicVote uses a modern dark-mesh glassmorphism aesthetic enhanced with vivid jewel tones:

| Tone | Hex / Gradient | Purpose |
|------|----------------|---------|
| **Electric Indigo** | `#6366f1` / Violet Gradient | Brand identity, primary buttons, system health |
| **Emerald Mint** | `#10b981` / Teal Gradient | Active elections, ballot confirmation, voter badges |
| **Amber Gold** | `#f59e0b` / Orange Gradient | Draft status, leader spotlight, winner trophy |
| **Cyan Sky** | `#06b6d4` / Blue Gradient | Cryptographic SHA-256 audit, hash verification |
| **Rose Coral** | `#f43f5e` / Crimson Gradient | Admin badge, closed elections, danger actions |
| **Amethyst Purple** | `#a855f7` / Magenta Gradient | Live results breakdown, celebration confetti |

---

## 🚀 Key Modules & Features

### 1. Elections & Voting Ledger (`/elections`)
- Filter races by status (`ALL`, `ACTIVE`, `DRAFT`, `CLOSED`).
- View candidate rosters with individual color-coded avatar badges.
- Check live voter eligibility status via `GET /api/votes/status/{electionId}`.
- Interactive **Anonymous Ballot Modal**:
  - Zero-knowledge ballot casting decoupling voter identity from choice.
  - Generates verifiable **Official Voting Receipt** with copyable SHA-256 hash.
  - Prevents duplicate voting via backend unique constraint handling (HTTP 409).

### 2. Live Results & Winner Podium (`/results`)
- Real-time polling with 4-second automatic sync.
- Winner spotlight featuring dynamic celebration confetti.
- Multi-color candidate share distribution progress bars with live percentages.
- Detailed tabular audit records showing timestamped Feign updates.
- Admin force recalculation trigger (`POST /api/results/{id}/calculate`).

### 3. Tamper-Evident Cryptographic Audit (`/audit`)
- Mathematical breakdown of the CivicVote SHA-256 hashing architecture.
- Full ledger integrity scanner (`GET /api/votes/audit/verify`):
  - Validates total ballots checked.
  - Compares stored hashes against 64-hexadecimal standards.
  - Displays overall cryptographic status (`VALID`).
- Browser-based **SHA-256 Hash Sandbox** to interactively test hash generation.

### 4. Administrator Console (`/admin`)
- Restricted to users with the `ADMIN` role.
- Create new elections with start and end schedules.
- Add candidates with tailored manifestos and color palettes.
- Full lifecycle control: Activate and close elections on demand.

### 5. Microservices System Monitor (`/architecture`)
- Interactive dashboard visualizing all 6 microservices:
  - **Eureka Server** (Port 8761)
  - **API Gateway** (Port 8080)
  - **Auth Service** (Port 8081)
  - **Election Service** (Port 8082)
  - **Voting Service** (Port 8083)
  - **Result Service** (Port 8084)
- Live health heartbeat and database schema mapping.

---

## ⚡ 1-Click Fast Credentials

For instant evaluation without manual typing, the navbar and login modal include one-click demo credentials:

| Role | Username | Password | Notes |
|------|----------|----------|-------|
| **Admin** | `admin_user` | `Password@123` | Full administrative control & audit rights |
| **Voter** | `voter_john` | `Password@123` | Standard citizen voting account |
| **Random Voter** | *(Auto-generated)* | `Password@123` | Instantly tests multiple voter ballots |

---

## 🛠️ Development & Build

```bash
# Navigate to frontend
cd civicvote/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
