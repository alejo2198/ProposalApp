# ProposalApp — Real Estate Offer Management Platform

A full-stack real estate platform where **Buyers** browse property listings and submit purchase offers, and **Agents** manage those offers in real time. Offer updates (accept / reject / counter) are pushed instantly via WebSockets using SignalR.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [1 — Database](#1--database)
  - [2 — Backend](#2--backend)
  - [3 — Frontend](#3--frontend)
- [Reviewer Guide](#reviewer-guide)
- [API Overview](#api-overview)
- [Real-Time Events](#real-time-events)

---

## Tech Stack

| Layer            | Technology                                              |
| ---------------- | ------------------------------------------------------- |
| Frontend         | React 19 + TypeScript, Vite, Tailwind CSS, React Router |
| HTTP Client      | Axios (auto-attaches JWT)                               |
| Real-time        | Microsoft SignalR                                       |
| Backend          | ASP.NET Core 10 (.NET 10)                               |
| Auth             | JWT (RS256, role claims)                                |
| ORM              | Entity Framework Core 10                                |
| Database         | SQL Server 2022                                         |
| Password hashing | BCrypt.Net                                              |
| API Docs         | Swagger / OpenAPI                                       |

---

## Project Structure

```
proposalapp/
├── proposalapp-client/   # React + TypeScript frontend
└── proposalapp-server/   # ASP.NET Core backend (API / Core / Infrastructure)
```

---

## Getting Started

### Prerequisites

- [Node.js 20+](https://nodejs.org/) and npm
- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for SQL Server) **or** a local SQL Server 2022 instance

---

### 1 — Database

Start SQL Server in Docker:

```bash
docker run \
  -e "ACCEPT_EULA=Y" \
  -e "MSSQL_SA_PASSWORD=PropFlow123!" \
  -p 1433:1433 \
  --name proposalapp-sql \
  -d mcr.microsoft.com/mssql/server:2022-latest
```

Then apply EF Core migrations from the server directory:

```bash
cd proposalapp-server
dotnet ef database update --project ProposalApp.Infrastructure --startup-project ProposalApp.API
```

---

### 2 — Backend

```bash
cd proposalapp-server/ProposalApp.API
dotnet run
```

The API starts at **`http://localhost:5018`**.  
Interactive Swagger docs are available at **`http://localhost:5018/swagger`**.

---

### 3 — Frontend

```bash
cd proposalapp-client
npm install
npm run dev
```

The client starts at **`http://localhost:5173`**.

---

## Reviewer Guide

The app has two distinct roles. To experience both sides of the workflow simultaneously, **open the app in two different browsers** (e.g., Chrome for one role and Firefox for the other) so each session has its own independent authentication state.

### Role 1 — Agent (Chrome)

1. Go to `http://localhost:5173` and register a new account, selecting **Agent** as the role.
2. After logging in, you land on the **Agent Dashboard**.
3. Create one or more property listings.
4. Click **Listen** on any listing to subscribe to real-time offer notifications via WebSocket.

### Role 2 — Buyer (Firefox)

1. Go to `http://localhost:5173` in Firefox and register a separate account, selecting **Buyer** as the role.
2. After logging in, you land on the **Listings** page.
3. Browse available properties and click on one to open the **Make an Offer** modal.
4. Submit an offer — the Agent browser should receive a toast notification instantly.

### Full Workflow

| Step | Buyer                               | Agent                                   |
| ---- | ----------------------------------- | --------------------------------------- |
| 1    | Submits offer                       | Receives real-time notification         |
| 2    | —                                   | Accepts, rejects, or counters the offer |
| 3    | Offer status updates on "My Offers" | Dashboard reflects the updated state    |

> **Tip:** You can register as many Buyer and Agent accounts as needed. Agents see offers across all listings; Buyers only see their own.

---

## API Overview

All endpoints are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint    | Auth | Description                          |
| ------ | ----------- | ---- | ------------------------------------ |
| POST   | `/register` | —    | Register a new user (Buyer or Agent) |
| POST   | `/login`    | —    | Log in and receive a JWT             |

### Listings — `/api/listings`

| Method | Endpoint | Auth  | Description          |
| ------ | -------- | ----- | -------------------- |
| GET    | `/`      | —     | Get all listings     |
| GET    | `/{id}`  | —     | Get a listing by ID  |
| POST   | `/`      | Agent | Create a new listing |
| PUT    | `/{id}`  | Agent | Update a listing     |
| DELETE | `/{id}`  | Agent | Delete a listing     |

### Offers — `/api/offers`

| Method | Endpoint               | Auth  | Description                            |
| ------ | ---------------------- | ----- | -------------------------------------- |
| POST   | `/`                    | Buyer | Submit a new offer                     |
| GET    | `/my-offers`           | Buyer | Get all offers for the logged-in buyer |
| GET    | `/listing/{listingId}` | Agent | Get all offers for a listing           |
| GET    | `/summary/{listingId}` | Agent | Offer stats for a listing              |
| PUT    | `/{id}/accept`         | Agent | Accept an offer                        |
| PUT    | `/{id}/reject`         | Agent | Reject an offer                        |
| PUT    | `/{id}/counter`        | Agent | Send a counter-offer                   |

---

## Real-Time Events

SignalR hub is mounted at `/hubs/offers`.

| Event          | Direction      | Triggered by                       |
| -------------- | -------------- | ---------------------------------- |
| `NewOffer`     | Server → Agent | Buyer submits an offer             |
| `OfferUpdated` | Server → Agent | Agent accepts / rejects / counters |

Agents join a listing-specific group (`JoinListingGroup`) to receive scoped notifications without seeing activity on other listings.
