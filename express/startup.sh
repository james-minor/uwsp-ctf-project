npx prisma db push

if [[ ${ENVIRONMENT_TYPE} == "test" ]]
then
  npm run test
else
  npm run start
fi
