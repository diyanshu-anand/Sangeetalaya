It is a visual blueprint that illustrates how a system, software application is structured, how its components interact, and how data move through it.

Brief Info-

Sangeetalaya is a music-course platform with a React client and Express/MongoDB backend. The visible user journey includes browsing course pages, signing up or logging in,
and a backend flow for creating payment orders and granting course access after QR verification or manual review. The graph preserves the documented authentication, course,
payment, and password-reset stages. Backend route and model links are supported by sampled source; frontend payment-to-API wiring is not established by the excerpts, so it is omitted.

Main entry points: 

payments.js -> Payment routes


auth.js -> Authentication routes


App.js -> Application router

server.js -> HTTP server

<img width="1550" height="928" alt="image" src="https://github.com/user-attachments/assets/1271859e-2fab-4d54-a420-f95f88c5dafd" />

