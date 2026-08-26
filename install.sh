#!/bin/sh
# 이 스킬을 대상 프로젝트의 스킬 폴더에 심링크로 설치합니다.
# 사용: ./install.sh [대상 프로젝트 경로]  (생략 시 현재 디렉터리)
set -e

SRC=$(cd "$(dirname "$0")" && pwd)
TARGET=${1:-$PWD}
[ -d "$TARGET" ] || { echo "대상 경로가 없습니다: $TARGET" >&2; exit 1; }

# 프로젝트가 이미 쓰고 있는 스킬 폴더를 그대로 따라갑니다.
for dir in .claude/skills .agents/skills skills; do
  if [ -d "$TARGET/$dir" ]; then
    ln -sfn "$SRC" "$TARGET/$dir/aside-browser"
    echo "설치 완료: $TARGET/$dir/aside-browser -> $SRC"
    exit 0
  fi
done

echo "스킬 폴더를 찾지 못했습니다 ($TARGET 아래 .claude/skills, .agents/skills, skills 중 하나가 필요)" >&2
exit 1
