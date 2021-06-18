import sys
import os
import hashlib
import socket

hostname = socket.gethostname()
local_ip = socket.gethostbyname(hostname)

def convert_text_to_sha1(text):
	digest = hashlib.sha1(text.encode()).hexdigest()
	return digest

def main():
	raw_sha1 = sys.argv[1]
	cleaned_raw_sha1 = raw_sha1.strip().lower()

	with open('./password-cracker/password.txt') as f:
		for line in f:
			password = line.strip()
			converted_sha1 = convert_text_to_sha1(password)
			
			if cleaned_raw_sha1 == converted_sha1:
				print(f"Password ditemukan: {password}")
				os.system(f"node ./kafka/producer/sendCompletedTask.js --task password_cracking --client_ip={local_ip} --msg='successfully cracking password' {raw_sha1} {password}")
				return

		# print("Tidak bisa menemukan password")
		os.system("echo Tidak bisa menemukan password")
		os.system(f"node ./kafka/producer/sendCompletedTask.js --task password_cracking --client_ip={local_ip} --msg='failed cracking password' {raw_sha1}")

if __name__ == "__main__":
	main()