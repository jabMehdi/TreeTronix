def ChecksumCalculator(StringRead):
    ChecksumInt = 0
    for i in range (0, int(len(StringRead)/2)):
        StringByte = StringRead[int(i*2):int(i*2+2)]
        ChecksumInt = ChecksumInt + int(hex(int(StringByte,16)),16)
    ChecksumIntModulo256 = ChecksumInt % 256
    if ChecksumIntModulo256 < 16:
        ChecksumResult = ("0"+hex(ChecksumIntModulo256 % 256)[-1]).upper()
    else:
        ChecksumResult = hex(ChecksumIntModulo256 % 256)[-2:].upper()
    return ChecksumResult



while True:
    print("Enter String:")
    StringReadTemp = input()
    print(ChecksumCalculator(StringReadTemp))
 