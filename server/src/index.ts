import app from "./app";

const PORT = process.env.PORT;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export { app, server };
