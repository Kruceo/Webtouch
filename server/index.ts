import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import type { Action, ConfigFile } from '../definitions';
import { console } from 'inspector';

let robot: typeof import("robotjs") | null = null

if (!process.argv[0].includes("/bin/bun")) {
    robot = (await import('robotjs')).default
}

if (!fs.existsSync("config.json"))
    fs.writeFileSync("config.json", JSON.stringify({
        gridTemplate: [3, 7],
        actions: []
    }))

async function startServer() {
    const app = express();
    app.use(express.json({ limit: "64kb" }))

    app.post("/action/:id", (req, res) => {
        const rawConfig = fs.readFileSync('./config.json', "utf-8")
        const config: ConfigFile = JSON.parse(rawConfig)
        const obj: Action = req.body
        config.actions[parseInt(req.params.id)] = obj
        fs.writeFileSync("config.json", JSON.stringify(config, null, 2))
        res.json({ error: false })
    })

    app.delete("/action/:id", (req, res) => {
        const rawConfig = fs.readFileSync('./config.json', "utf-8")
        const config: ConfigFile & { actions: null[] } = JSON.parse(rawConfig)
        config.actions[parseInt(req.params.id)] = null
        fs.writeFileSync("config.json", JSON.stringify(config, null, 2))
        res.json({ error: false })
    })

    app.get("/grid/", (req, res) => {
        const rawConfig = fs.readFileSync('./config.json', "utf-8")
        const config: ConfigFile = JSON.parse(rawConfig)
        res.json(config.gridTemplate)
    })


    app.post("/grid/", (req, res) => {
        console.log("Getting grid")
        const rawConfig = fs.readFileSync('./config.json', "utf-8")
        const config: ConfigFile = JSON.parse(rawConfig)
        const obj: { cols: number, rows: number } = req.body
        config.gridTemplate = [obj.cols, obj.rows]
        fs.writeFileSync("config.json", JSON.stringify(config, null, 2))
        res.json({ error: false })
    })

    app.get("/config", (req, res) => {
        const rawConfig = fs.readFileSync('./config.json', "utf-8")
        const config: ConfigFile = JSON.parse(rawConfig)
        res.json(config)
    })

    app.get("/spawn/action/:id", async (req, res) => {
        const rawConfig = fs.readFileSync('./config.json', "utf-8")
        const config: ConfigFile = JSON.parse(rawConfig)
        const action = config.actions.at(parseInt(req.params.id))
        console.log(action)
        if (action) {
            if (action.type == "command") {
                try {
                    const cp = await import("child_process")
                    cp.execSync(action.value, { timeout: 10000 })
                } catch (error) {
                    console.error(error)
                }
            }
            if (action.type == "keypress") {
                if (!robot) {
                    res.end()
                    return console.warn("robotjs not works with bunjs")

                }

                let keys = action.value.split("+")

                let normalKeys: string[] = []
                let modifierKeys = keys.filter(key => {
                    if (["alt", "command", "control", "shift"].includes(key)) {
                        return key
                    }
                    normalKeys.push(key)
                })
                try {
                    for (const key of normalKeys) {
                        robot.keyTap(key, modifierKeys);
                    }
                }
                catch (error) {
                    console.error(error)
                    res.json({ error: true, ...config })
                    return
                }
            }
            if (action.type == "write-text") {
                if (!robot) {
                    res.end()
                    return console.warn("robotjs not works with bunjs")

                }


                try {
                    robot.typeString(action.value)
                }
                catch (error) {
                    console.error(error)
                    res.json({ error: true, ...config })
                    return
                }
            }
        }

        res.json(config)
    })

    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true }
        });

        // Usando Vite como middleware
        app.use(vite.middlewares);
    } else {
        console.log("Production mode")
        // Se for produção, sirva os arquivos estáticos do diretório 'dist'
        app.use(express.static(path.resolve('dist')));

        // Adicione uma rota que sirva 'index.html' para todas as rotas
        app.get('*', (req, res) => {
            const htmlPath = path.resolve('dist', 'index.html');
            if (fs.existsSync(htmlPath)) {
                res.sendFile(htmlPath);
            } else {
                res.status(404).send('Página não encontrada');
            }
        });
    }

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`App rodando em http://localhost:${port}`);
    });
}

startServer();