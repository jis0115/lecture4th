import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import models from '../../models'

const check = async (req, res, next) => {
  try {
    console.log(req.user)

    return res.status(200)
      .json({ message: '인증되었습니다. 축하합니다!' })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    // 요청을 보낼때, nickname 과 password 를 body 에 담아서 줌
    const nickname = req.body.nickname
    const password = req.body.password

    const user = await models.User.findOne({
      where: {
        nickname
      }
    })

    if (!user) {
      return res.status(404)
        .json({ message: '사용자를 찾을 수 없습니다.' })
    }

    const isUserPasswordMatch = await comparePassword(password, user.password)

    if (!isUserPasswordMatch) {
      return res.status(422)
        .json({ message: '비밀번호가 일치하지 않습니다.' })
    }

    const accessToken = jwt.sign(
      {
        uid: user.uid,
        nickname: user.nickname
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRESIN }
    )

    return res.status(200)
      .json({ accessToken })
  } catch (err) {
    next(err)
  }
}

const comparePassword = async (password, password2) => {
  const match = await bcrypt.compare(password, password2)

  return match
}

export {
  login,
  check
}