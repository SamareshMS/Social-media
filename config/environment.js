

const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'something',
    db: 'sodia_development',
    smpt: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: '',
            pass: ''
        }
    },
    google_client_id: "1061920155402-urllnvh1la4vc6qh6sfmvaol3bai16ot.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'sodia',
}

const production = {
    name: 'production'
}

module.exports = development;