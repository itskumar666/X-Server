export function userAuthenticate(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = jwt.verify(token, "shivamdubeyfd");
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}