const { S3 } = require("aws-sdk");
/* const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");*/


exports.s3Uploadv2 = async (files) => {
    /* same as module.exports = {s3Uploadv2} */

    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-east-1'
    });


  const params = files.map((file) => {
    return {
      Bucket: 'jwt-postgre-tes',
      Key: `${file.originalname}`,
        /* file.buffer likely contains the binary data of the file being uploaded to Amazon S3. When you create an object to upload to S3, you include this binary data (file.buffer) as the Body of the S3 upload operatio. */
        /* s3 wants this field to be a buffer of binaries (usually img, vid...) */
      Body: file.buffer,
    };
  });

  
  return await Promise.all(params.map((param) => s3.upload(param).promise()));
};

