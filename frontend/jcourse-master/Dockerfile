# 阶段 1: 依赖安装
FROM node:25-alpine AS deps
WORKDIR /app

# 使用国内镜像加速
RUN npm config set registry https://registry.npmmirror.com

# 安装依赖
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# 阶段 2: 构建应用
FROM node:25-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 接收构建参数，使 next.config.js 中的 rewrites 生效
ARG REMOTE_URL
ENV REMOTE_URL=$REMOTE_URL

# 设置环境变量
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 构建应用（standalone 模式）
RUN yarn build

# 阶段 3: 生产运行
FROM node:25-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
