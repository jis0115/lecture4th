import jwt from 'jsonwebtoken'
import models from '../models'

export default async (req, res, next) => {
  try {
    const userToken = req.headers.authorization.split(' ')[1]

    let payload

    jwt.verify(
      userToken,
      process.env.JWT_SECRET,
      (err, body) => {
        if (err) {
          return res.status(401)
            .json({ message: '유효한 JWT 가 아닙니다.' })
        }

        payload = body
      }
    )

    let user = null

    user = await models.User.findOne({
      where: {
        uid: Buffer(payload.uid, 'hex')
      }
    })

    // eslint-disable-next-line require-atomic-updates
    req.user = user

    next()
  } catch (err) {
    next(err)
  }
}





/*
req.user = null

    if (req.headers.authorization) {
      let uuid
      jwt.verify(
        req.headers.authorization.split(' ')[1],
        process.env.JWT_SECRET,
        (err, payload) => {
          if (err) {
            return next(createError(401, '토큰 정보가 유효하지 않습니다.'))
          }

          uuid = payload.uuid
        }
      )

      const userRepo = new UserRepo()
      const user = await userRepo.find(uuid)

      if (!user) {
        return next(createError(404, '사용자를 찾을 수 없습니다.'))
      }

      req.user = user
    }

    next()
*/