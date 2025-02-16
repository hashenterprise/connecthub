import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, (err, fields, files: { [key: string]: File }) => {
    if (err) {
      res.status(500).json({ error: 'Error parsing the files' });
      return;
    }

    // Process the uploaded files here
    res.status(200).json({ fields, files });
  });
}